from flask import Blueprint, request, jsonify

whatsapp_bp = Blueprint('whatsapp', __name__)

@whatsapp_bp.route('/webhook', methods=['GET'])
def verify_webhook():
    """Verify WhatsApp webhook"""
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')
    
    if mode == 'subscribe' and token == 'beauty_palace_verify':
        return challenge
    else:
        return 'Forbidden', 403

@whatsapp_bp.route('/webhook', methods=['POST'])
def handle_webhook():
    """Handle incoming WhatsApp messages"""
    try:
        data = request.get_json()
        # Process webhook data here
        return 'OK', 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
