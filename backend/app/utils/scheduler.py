from datetime import datetime, timedelta

class AppointmentScheduler:
    def __init__(self):
        print("📅 Appointment Scheduler initialized")
    
    def schedule_reminder(self, appointment_id):
        """Schedule a reminder (mock implementation)"""
        print(f"⏰ Reminder scheduled for appointment {appointment_id}")
        return True
    
    def cancel_reminder(self, appointment_id):
        """Cancel scheduled reminder"""
        print(f"❌ Reminder cancelled for appointment {appointment_id}")
        return True

# Initialize scheduler
appointment_scheduler = AppointmentScheduler()
