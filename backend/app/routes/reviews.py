from flask import Blueprint, request, jsonify
from app.utils.supabase_client import get_supabase
from app.utils.auth_helpers import token_required, admin_required
from app.utils.whatsapp import WhatsAppService

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('', methods=['GET'])
def get_approved_reviews():
    try:
        supabase = get_supabase()
        
        result = supabase.table('reviews').select('''
            *,
            profiles:user_id(name),
            review_images(*)
        ''').eq('status', 'approved').order('created_at', desc=True).execute()
        
        return jsonify({
            'reviews': result.data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/all', methods=['GET'])
@admin_required
def get_all_reviews(current_user_id):
    try:
        supabase = get_supabase()
        
        result = supabase.table('reviews').select('''
            *,
            profiles:user_id(name, phone),
            review_images(*)
        ''').order('created_at', desc=True).execute()
        
        return jsonify({
            'reviews': result.data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('', methods=['POST'])
@token_required
def create_review(current_user_id):
    try:
        data = request.get_json()
        supabase = get_supabase()
        
        # Validate required fields
        required_fields = ['service_name', 'rating', 'comment']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        if not (1 <= data['rating'] <= 5):
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        # Create review
        result = supabase.table('reviews').insert({
            'user_id': current_user_id,
            'service_name': data['service_name'],
            'rating': data['rating'],
            'comment': data['comment']
        }).execute()
        
        if result.data:
            review = result.data[0]
            
            # Get user details for WhatsApp notification
            user_result = supabase.table('profiles').select('*').eq('id', current_user_id).execute()
            user = user_result.data[0] if user_result.data else {}
            
            # Send WhatsApp thank you message
            try:
                whatsapp = WhatsAppService()
                if user.get('phone'):
                    whatsapp.send_review_thank_you(
                        user['phone'],
                        user['name'],
                        data['service_name']
                    )
            except Exception as whatsapp_error:
                print(f"WhatsApp notification error: {whatsapp_error}")
            
            return jsonify({
                'message': 'Review submitted successfully',
                'review': review
            }), 201
        else:
            return jsonify({'error': 'Failed to create review'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/<review_id>/status', methods=['PUT'])
@admin_required
def update_review_status(current_user_id, review_id):
    try:
        data = request.get_json()
        status = data.get('status')
        
        if status not in ['pending', 'approved', 'rejected']:
            return jsonify({'error': 'Invalid status'}), 400
        
        supabase = get_supabase()
        
        result = supabase.table('reviews').update({
            'status': status
        }).eq('id', review_id).execute()
        
        if result.data:
            return jsonify({
                'message': 'Review status updated successfully',
                'review': result.data[0]
            }), 200
        else:
            return jsonify({'error': 'Review not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
