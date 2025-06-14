from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from datetime import datetime, timedelta
from app import db
from app.models.appointment import Appointment
from app.utils.whatsapp import whatsapp_service
import atexit

class AppointmentScheduler:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.scheduler.start()
        atexit.register(lambda: self.scheduler.shutdown())
    
    def schedule_reminder(self, appointment_id):
        """Schedule a reminder 1 hour before appointment"""
        try:
            appointment = Appointment.query.get(appointment_id)
            if not appointment or appointment.status != 'upcoming':
                return False
            
            # Calculate reminder time (1 hour before appointment)
            appointment_datetime = datetime.combine(
                appointment.appointment_date,
                appointment.appointment_time
            )
            reminder_time = appointment_datetime - timedelta(hours=1)
            
            # Only schedule if reminder time is in the future
            if reminder_time > datetime.now():
                job_id = f"reminder_{appointment_id}"
                
                # Remove existing job if any
                try:
                    self.scheduler.remove_job(job_id)
                except:
                    pass
                
                # Schedule new reminder
                self.scheduler.add_job(
                    func=self._send_reminder,
                    trigger=DateTrigger(run_date=reminder_time),
                    args=[appointment_id],
                    id=job_id,
                    replace_existing=True
                )
                
                print(f"Reminder scheduled for appointment {appointment_id} at {reminder_time}")
                return True
            
            return False
            
        except Exception as e:
            print(f"Error scheduling reminder: {str(e)}")
            return False
    
    def _send_reminder(self, appointment_id):
        """Send reminder message (called by scheduler)"""
        try:
            appointment = Appointment.query.get(appointment_id)
            if not appointment or appointment.status != 'upcoming':
                return
            
            # Send WhatsApp reminder
            success = whatsapp_service.send_appointment_reminder(
                client_name=appointment.user.name,
                client_phone=appointment.user.phone,
                service_name=appointment.service.name,
                appointment_date=appointment.appointment_date,
                appointment_time=appointment.appointment_time
            )
            
            if success:
                print(f"Reminder sent successfully for appointment {appointment_id}")
            else:
                print(f"Failed to send reminder for appointment {appointment_id}")
                
        except Exception as e:
            print(f"Error sending reminder: {str(e)}")
    
    def cancel_reminder(self, appointment_id):
        """Cancel scheduled reminder"""
        try:
            job_id = f"reminder_{appointment_id}"
            self.scheduler.remove_job(job_id)
            print(f"Reminder cancelled for appointment {appointment_id}")
            return True
        except:
            return False
    
    def reschedule_reminder(self, appointment_id):
        """Reschedule reminder for updated appointment"""
        self.cancel_reminder(appointment_id)
        return self.schedule_reminder(appointment_id)

# Initialize scheduler
appointment_scheduler = AppointmentScheduler()
