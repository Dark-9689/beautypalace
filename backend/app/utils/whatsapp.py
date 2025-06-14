import requests
import os
from datetime import datetime

class WhatsAppService:
    def __init__(self):
        self.api_url = "https://graph.facebook.com/v18.0"
        self.phone_number_id = os.environ.get('WHATSAPP_PHONE_NUMBER_ID')
        self.access_token = os.environ.get('WHATSAPP_ACCESS_TOKEN')
        self.owner_phone = os.environ.get('OWNER_WHATSAPP_NUMBER', '919876543210')
        
    def send_message(self, to_phone, message_text):
        """Send WhatsApp message (mock implementation for development)"""
        try:
            print(f"📱 WhatsApp Message to {to_phone}:")
            print(f"📝 {message_text}")
            print("-" * 50)
            return True
        except Exception as e:
            print(f"WhatsApp error: {str(e)}")
            return False
    
    def send_booking_confirmation(self, client_name, client_phone, service_name, appointment_date, appointment_time, duration):
        """Send booking confirmation to client"""
        message = f"""🌟 Beauty Palace Booking Confirmed! 🌟

Hello {client_name}! ✨

Your appointment has been successfully booked:

📅 Date: {appointment_date.strftime('%A, %B %d, %Y')}
⏰ Time: {appointment_time.strftime('%I:%M %p')}
💄 Service: {service_name}
⏱️ Duration: {duration} minutes

We're excited to pamper you! 💅✨"""

        return self.send_message(client_phone, message)

# Initialize WhatsApp service
whatsapp_service = WhatsAppService()
