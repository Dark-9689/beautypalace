from app.utils.whatsapp import whatsapp_service
from datetime import datetime, time, date

def test_whatsapp_integration():
    """Test WhatsApp integration with sample data"""
    
    # Test booking confirmation
    print("Testing booking confirmation...")
    success = whatsapp_service.send_booking_confirmation(
        client_name="Test Client",
        client_phone="919876543210",  # Replace with your test number
        service_name="Haircut & Styling",
        appointment_date=date(2024, 12, 25),
        appointment_time=time(14, 30),
        duration=60
    )
    print(f"Booking confirmation: {'✅ Success' if success else '❌ Failed'}")
    
    # Test owner notification
    print("Testing owner notification...")
    success = whatsapp_service.send_owner_notification(
        client_name="Test Client",
        client_phone="919876543210",
        service_name="Haircut & Styling",
        appointment_date=date(2024, 12, 25),
        appointment_time=time(14, 30),
        duration=60
    )
    print(f"Owner notification: {'✅ Success' if success else '❌ Failed'}")
    
    # Test reminder
    print("Testing appointment reminder...")
    success = whatsapp_service.send_appointment_reminder(
        client_name="Test Client",
        client_phone="919876543210",
        service_name="Haircut & Styling",
        appointment_date=date(2024, 12, 25),
        appointment_time=time(14, 30)
    )
    print(f"Appointment reminder: {'✅ Success' if success else '❌ Failed'}")
    
    # Test review thank you
    print("Testing review thank you...")
    success = whatsapp_service.send_review_thank_you(
        client_name="Test Client",
        client_phone="919876543210",
        rating=5
    )
    print(f"Review thank you: {'✅ Success' if success else '❌ Failed'}")

if __name__ == "__main__":
    test_whatsapp_integration()
