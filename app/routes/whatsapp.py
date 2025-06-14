from flask import Blueprint, request, jsonify
from app.utils.whatsapp import whatsapp_service
import hmac
import hashlib
import os

whatsapp_bp = Blueprint('whatsapp', __name__)

@whatsapp_bp.route('/webhook', methods=['GET'])
def verify_webhook():
    """Verify WhatsApp webhook"""
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')
    
    verify_token = os.environ.get('WHATSAPP_VERIFY_TOKEN', 'beauty_palace_verify')
    
    if mode == 'subscribe' and token == verify_token:
        return challenge
    else:
        return 'Forbidden', 403

@whatsapp_bp.route('/webhook', methods=['POST'])
def handle_webhook():
    """Handle incoming WhatsApp messages"""
    try:
        data = request.get_json()
        
        # Verify webhook signature
        signature = request.headers.get('X-Hub-Signature-256')
        if not verify_signature(request.data, signature):
            return 'Unauthorized', 401
        
        # Process incoming messages
        if 'messages' in data.get('entry', [{}])[0].get('changes', [{}])[0].get('value', {}):
            messages = data['entry'][0]['changes'][0]['value']['messages']
            
            for message in messages:
                phone_number = message['from']
                message_text = message.get('text', {}).get('body', '').lower()
                
                # Auto-reply based on message content
                if 'book' in message_text or 'appointment' in message_text:
                    reply = """📅 *Book Your Appointment* 📅

Thank you for your interest! Here's how to book:

🌐 *Online:* Visit our website
📞 *Call:* +91-XXXXXXXXXX
📱 *WhatsApp:* Send us your preferred date and time

*Available Services:*
💄 Haircut & Styling
✨ Facial Treatment
🌟 Hair Smoothing
💅 Keratin Treatment
🧴 Waxing Services
💋 Professional Makeup

*Hours:*
Mon-Fri: 9 AM - 7 PM
Saturday: 9 AM - 6 PM
Sunday: 10 AM - 4 PM

*Beauty Palace Team* 💕"""
                    
                    whatsapp_service.send_message(phone_number, reply)
                
                elif 'price' in message_text or 'cost' in message_text:
                    reply = """💰 *Our Service Prices* 💰

💄 *Haircut & Styling:* ₹800-1500
✨ *Facial Treatment:* ₹1200-2500
🌟 *Hair Smoothing:* ₹3000-5000
💅 *Keratin Treatment:* ₹4000-8000
🧴 *Waxing Services:* ₹500-1500
💋 *Professional Makeup:* ₹2000-4000

*Prices vary based on hair length and specific requirements*

📞 Call for exact pricing and consultation!

*Beauty Palace Team* 💕"""
                    
                    whatsapp_service.send_message(phone_number, reply)
                
                elif 'location' in message_text or 'address' in message_text:
                    reply = """📍 *Beauty Palace Location* 📍

*Address:*
Beauty Palace Saswad
Pune, Maharashtra, India

*Landmarks:*
• Near Saswad Bus Stand
• Opposite City Bank
• Next to Medical Store

*Parking:* Available
*Accessibility:* Ground floor

*Directions:*
🚗 Google Maps: Search "Beauty Palace Saswad"
🚌 Bus: Saswad Bus Stand (2 min walk)

See you soon! ✨

*Beauty Palace Team* 💕"""
                    
                    whatsapp_service.send_message(phone_number, reply)
                
                else:
                    # Default reply
                    reply = """🌟 *Welcome to Beauty Palace!* 🌟

Thank you for contacting us! 💕

*Quick Help:*
📅 Type "book" for appointment booking
💰 Type "price" for service pricing
📍 Type "location" for our address

*Or call us directly:*
📞 +91-XXXXXXXXXX

Our team will respond shortly!

*Beauty Palace Team* ✨"""
                    
                    whatsapp_service.send_message(phone_number, reply)
        
        return 'OK', 200
        
    except Exception as e:
        print(f"Webhook error: {str(e)}")
        return 'Error', 500

def verify_signature(payload, signature):
    """Verify webhook signature"""
    try:
        app_secret = os.environ.get('WHATSAPP_APP_SECRET')
        if not app_secret:
            return True  # Skip verification in development
        
        expected_signature = hmac.new(
            app_secret.encode('utf-8'),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(f"sha256={expected_signature}", signature)
    except:
        return False
