import requests
import os
from datetime import datetime, timedelta
from flask import current_app
import json

class WhatsAppService:
    def __init__(self):
        self.api_url = "https://graph.facebook.com/v18.0"
        self.phone_number_id = os.environ.get('WHATSAPP_PHONE_NUMBER_ID')
        self.access_token = os.environ.get('WHATSAPP_ACCESS_TOKEN')
        self.owner_phone = os.environ.get('OWNER_WHATSAPP_NUMBER', '1234567890')
        
    def send_message(self, to_phone, message_text, template_name=None, template_params=None):
        """Send WhatsApp message using Facebook Graph API"""
        try:
            # Clean phone number (remove non-digits)
            clean_phone = ''.join(filter(str.isdigit, to_phone))
            
            # Add country code if not present (assuming India +91)
            if not clean_phone.startswith('91') and len(clean_phone) == 10:
                clean_phone = '91' + clean_phone
            
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            if template_name and template_params:
                # Use WhatsApp Business Template
                payload = {
                    "messaging_product": "whatsapp",
                    "to": clean_phone,
                    "type": "template",
                    "template": {
                        "name": template_name,
                        "language": {"code": "en"},
                        "components": [
                            {
                                "type": "body",
                                "parameters": template_params
                            }
                        ]
                    }
                }
            else:
                # Send text message
                payload = {
                    "messaging_product": "whatsapp",
                    "to": clean_phone,
                    "type": "text",
                    "text": {"body": message_text}
                }
            
            response = requests.post(
                f"{self.api_url}/{self.phone_number_id}/messages",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                current_app.logger.info(f"WhatsApp message sent successfully to {clean_phone}")
                return True
            else:
                current_app.logger.error(f"WhatsApp API error: {response.text}")
                return False
                
        except Exception as e:
            current_app.logger.error(f"WhatsApp service error: {str(e)}")
            return False
    
    def send_booking_confirmation(self, client_name, client_phone, service_name, appointment_date, appointment_time, duration):
        """Send booking confirmation to client"""
        message = f"""🌟 *Beauty Palace Booking Confirmed!* 🌟

Hello {client_name}! ✨

Your appointment has been successfully booked:

📅 *Date:* {appointment_date.strftime('%A, %B %d, %Y')}
⏰ *Time:* {appointment_time.strftime('%I:%M %p')}
💄 *Service:* {service_name}
⏱️ *Duration:* {duration} minutes

📍 *Location:* Beauty Palace Saswad, Pune

*Important Notes:*
• Please arrive 10 minutes early
• Bring a valid ID for verification
• Cancellations must be made 24 hours in advance
• You'll receive a reminder 1 hour before your appointment

We're excited to pamper you! 💅✨

For any queries, reply to this message or call us.

*Beauty Palace Team* 💕"""

        return self.send_message(client_phone, message)
    
    def send_owner_notification(self, client_name, client_phone, service_name, appointment_date, appointment_time, duration):
        """Send new booking notification to owner"""
        message = f"""🔔 *NEW BOOKING ALERT!* 🔔

*Client Details:*
👤 Name: {client_name}
📞 Phone: {client_phone}

*Appointment Details:*
💄 Service: {service_name}
📅 Date: {appointment_date.strftime('%A, %B %d, %Y')}
⏰ Time: {appointment_time.strftime('%I:%M %p')}
⏱️ Duration: {duration} minutes

*Action Required:*
✅ Confirm appointment availability
📋 Prepare service materials
📞 Contact client if needed

*Beauty Palace Admin Panel* 💼"""

        return self.send_message(self.owner_phone, message)
    
    def send_appointment_reminder(self, client_name, client_phone, service_name, appointment_date, appointment_time):
        """Send 1-hour reminder to client"""
        message = f"""⏰ *Appointment Reminder* ⏰

Hello {client_name}! 

This is a friendly reminder that your appointment at *Beauty Palace* is in 1 hour:

💄 *Service:* {service_name}
📅 *Date:* {appointment_date.strftime('%A, %B %d, %Y')}
⏰ *Time:* {appointment_time.strftime('%I:%M %p')}

📍 *Address:* Beauty Palace Saswad, Pune

*Please:*
• Arrive 10 minutes early
• Bring a valid ID
• Wear comfortable clothing

Looking forward to seeing you! ✨

*Beauty Palace Team* 💕"""

        return self.send_message(client_phone, message)
    
    def send_review_thank_you(self, client_name, client_phone, rating):
        """Send thank you message after review submission"""
        message = f"""💕 *Thank You for Your Review!* 💕

Dear {client_name},

Thank you so much for taking the time to share your experience with us! ⭐ Your {rating}-star review means the world to our team.

Your feedback helps us:
✨ Improve our services
💪 Motivate our team
🌟 Help other clients choose us

We're thrilled that you loved your experience at Beauty Palace! 

*Special Offer:* Get 10% off your next appointment as a thank you for your review! 🎁

Book your next appointment:
📞 Call us or WhatsApp
💻 Visit our website

*Beauty Palace Team* 💄✨"""

        return self.send_message(client_phone, message)
    
    def send_appointment_cancellation(self, client_name, client_phone, service_name, appointment_date, appointment_time, reason=""):
        """Send cancellation notification to client"""
        message = f"""❌ *Appointment Cancelled* ❌

Hello {client_name},

We regret to inform you that your appointment has been cancelled:

💄 *Service:* {service_name}
📅 *Date:* {appointment_date.strftime('%A, %B %d, %Y')}
⏰ *Time:* {appointment_time.strftime('%I:%M %p')}

{f'*Reason:* {reason}' if reason else ''}

*Next Steps:*
📞 Call us to reschedule: +91-XXXXXXXXXX
💻 Book online through our website
📱 Reply to this message

We apologize for any inconvenience and look forward to serving you soon! 

*Beauty Palace Team* 💕"""

        return self.send_message(client_phone, message)

# Initialize WhatsApp service
whatsapp_service = WhatsAppService()
