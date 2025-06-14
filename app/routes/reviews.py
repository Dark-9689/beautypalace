from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app import db
from app.models.review import Review, ReviewImage
from app.models.user import User
from app.utils.file_upload import allowed_file, save_uploaded_file
from app.utils.whatsapp import whatsapp_service
import os

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/', methods=['GET'])
def get_reviews():
    """Get all approved reviews"""
    reviews = Review.query.filter_by(status='approved').order_by(Review.created_at.desc()).all()
    return jsonify([review.to_dict() for review in reviews])

@reviews_bp.route('/', methods=['POST'])
def create_review():
    """Create a new review with optional images and WhatsApp thank you"""
    try:
        data = request.form
        files = request.files.getlist('images')
        
        # Validate required fields
        if not data.get('name') or not data.get('comment'):
            return jsonify({'error': 'Name and comment are required'}), 400
        
        # Create or get user
        user = User.query.filter_by(name=data['name']).first()
        if not user:
            user = User(
                name=data['name'],
                phone=data.get('phone', ''),
                email=data.get('email')
            )
            db.session.add(user)
            db.session.flush()  # Get user ID
        
        # Create review
        review = Review(
            user_id=user.id,
            service_name=data.get('service_name', 'General'),
            rating=int(data.get('rating', 5)),
            comment=data['comment'],
            status='pending'  # Admin approval required
        )
        db.session.add(review)
        db.session.flush()  # Get review ID
        
        # Handle image uploads (max 2)
        if files and len(files) <= 2:
            for file in files:
                if file and file.filename and allowed_file(file.filename):
                    filename = save_uploaded_file(file, 'reviews')
                    if filename:
                        review_image = ReviewImage(
                            review_id=review.id,
                            image_path=f'/api/uploads/reviews/{filename}'
                        )
                        db.session.add(review_image)
        
        db.session.commit()
        
        # Send thank you WhatsApp message
        try:
            if user.phone:
                whatsapp_service.send_review_thank_you(
                    client_name=user.name,
                    client_phone=user.phone,
                    rating=review.rating
                )
        except Exception as e:
            print(f"Failed to send review thank you: {str(e)}")
        
        return jsonify({
            'message': 'Review submitted successfully! Thank you for your feedback.',
            'review': review.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/admin', methods=['GET'])
def get_all_reviews():
    """Get all reviews for admin (including pending)"""
    reviews = Review.query.order_by(Review.created_at.desc()).all()
    return jsonify([review.to_dict() for review in reviews])

@reviews_bp.route('/<int:review_id>/status', methods=['PUT'])
def update_review_status(review_id):
    """Update review status (approve/reject)"""
    try:
        data = request.get_json()
        review = Review.query.get_or_404(review_id)
        
        if data.get('status') in ['approved', 'rejected']:
            review.status = data['status']
            db.session.commit()
            
            # Send notification if approved
            if data['status'] == 'approved' and review.user.phone:
                try:
                    message = f"""🌟 *Review Approved!* 🌟

Hello {review.user.name}!

Great news! Your review has been approved and is now live on our website! ✨

Thank you for sharing your experience with Beauty Palace. Your feedback helps other clients discover our services.

*Special Offer:* Enjoy 15% off your next appointment as a thank you! 🎁

Book your next visit:
📞 Call or WhatsApp us
💻 Visit our website

*Beauty Palace Team* 💕"""

                    whatsapp_service.send_message(review.user.phone, message)
                except Exception as e:
                    print(f"Failed to send review approval notification: {str(e)}")
            
            return jsonify({'message': f'Review {data["status"]} successfully'})
        
        return jsonify({'error': 'Invalid status'}), 400
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
