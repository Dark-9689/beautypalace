from flask import Blueprint, request, jsonify
from app import db
from app.models.appointment import Appointment
from app.models.user import User
from app.models.service import Service
from app.utils.whatsapp import whatsapp_service
from app.utils.scheduler import appointment_scheduler
from datetime import datetime, date, time

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('/', methods=['POST'])
def create_appointment():
    """Create a new appointment with WhatsApp notifications"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'phone', 'service_id', 'appointment_date', 'appointment_time']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create or get user
        user = User.query.filter_by(phone=data['phone']).first()
        if not user:
            user = User(
                name=data['name'],
                phone=data['phone'],
                email=data.get('email')
            )
            db.session.add(user)
            db.session.flush()
        
        # Validate service exists
        service = Service.query.get(data['service_id'])
        if not service:
            return jsonify({'error': 'Service not found'}), 404
        
        # Parse date and time
        appointment_date = datetime.strptime(data['appointment_date'], '%Y-%m-%d').date()
        appointment_time = datetime.strptime(data['appointment_time'], '%H:%M').time()
        
        # Check for conflicts
        existing = Appointment.query.filter_by(
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            status='upcoming'
        ).first()
        
        if existing:
            return jsonify({'error': 'Time slot already booked'}), 409
        
        # Create appointment
        appointment = Appointment(
            user_id=user.id,
            service_id=service.id,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            notes=data.get('notes')
        )
        
        db.session.add(appointment)
        db.session.commit()
        
        # Send WhatsApp notifications
        try:
            # Send confirmation to client
            client_success = whatsapp_service.send_booking_confirmation(
                client_name=user.name,
                client_phone=user.phone,
                service_name=service.name,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                duration=service.duration
            )
            
            # Send notification to owner
            owner_success = whatsapp_service.send_owner_notification(
                client_name=user.name,
                client_phone=user.phone,
                service_name=service.name,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                duration=service.duration
            )
            
            # Schedule reminder
            reminder_scheduled = appointment_scheduler.schedule_reminder(appointment.id)
            
            notification_status = {
                'client_notified': client_success,
                'owner_notified': owner_success,
                'reminder_scheduled': reminder_scheduled
            }
            
        except Exception as e:
            print(f"WhatsApp notification error: {str(e)}")
            notification_status = {
                'client_notified': False,
                'owner_notified': False,
                'reminder_scheduled': False,
                'error': str(e)
            }
        
        return jsonify({
            'message': 'Appointment booked successfully!',
            'appointment': appointment.to_dict(),
            'notifications': notification_status
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/', methods=['GET'])
def get_appointments():
    """Get appointments with optional filtering"""
    try:
        # Query parameters
        date_filter = request.args.get('date')
        service_id = request.args.get('service_id')
        status = request.args.get('status', 'upcoming')
        
        query = Appointment.query
        
        if date_filter:
            filter_date = datetime.strptime(date_filter, '%Y-%m-%d').date()
            query = query.filter(Appointment.appointment_date == filter_date)
        
        if service_id:
            query = query.filter(Appointment.service_id == service_id)
        
        if status:
            query = query.filter(Appointment.status == status)
        
        appointments = query.order_by(
            Appointment.appointment_date.asc(),
            Appointment.appointment_time.asc()
        ).all()
        
        return jsonify([appointment.to_dict() for appointment in appointments])
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/<int:appointment_id>/status', methods=['PUT'])
def update_appointment_status(appointment_id):
    """Update appointment status with WhatsApp notifications"""
    try:
        data = request.get_json()
        appointment = Appointment.query.get_or_404(appointment_id)
        old_status = appointment.status
        
        if data.get('status') in ['upcoming', 'completed', 'cancelled']:
            appointment.status = data['status']
            db.session.commit()
            
            # Handle status-specific actions
            if data['status'] == 'cancelled' and old_status != 'cancelled':
                # Cancel reminder
                appointment_scheduler.cancel_reminder(appointment_id)
                
                # Send cancellation notification
                try:
                    whatsapp_service.send_appointment_cancellation(
                        client_name=appointment.user.name,
                        client_phone=appointment.user.phone,
                        service_name=appointment.service.name,
                        appointment_date=appointment.appointment_date,
                        appointment_time=appointment.appointment_time,
                        reason=data.get('reason', '')
                    )
                except Exception as e:
                    print(f"Failed to send cancellation notification: {str(e)}")
            
            elif data['status'] == 'upcoming' and old_status == 'cancelled':
                # Reschedule reminder if appointment is reactivated
                appointment_scheduler.schedule_reminder(appointment_id)
            
            return jsonify({
                'message': f'Appointment {data["status"]} successfully',
                'appointment': appointment.to_dict()
            })
        
        return jsonify({'error': 'Invalid status'}), 400
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/<int:appointment_id>/reschedule', methods=['PUT'])
def reschedule_appointment(appointment_id):
    """Reschedule an appointment"""
    try:
        data = request.get_json()
        appointment = Appointment.query.get_or_404(appointment_id)
        
        # Parse new date and time
        new_date = datetime.strptime(data['appointment_date'], '%Y-%m-%d').date()
        new_time = datetime.strptime(data['appointment_time'], '%H:%M').time()
        
        # Check for conflicts
        existing = Appointment.query.filter_by(
            appointment_date=new_date,
            appointment_time=new_time,
            status='upcoming'
        ).filter(Appointment.id != appointment_id).first()
        
        if existing:
            return jsonify({'error': 'Time slot already booked'}), 409
        
        # Update appointment
        old_date = appointment.appointment_date
        old_time = appointment.appointment_time
        
        appointment.appointment_date = new_date
        appointment.appointment_time = new_time
        db.session.commit()
        
        # Reschedule reminder
        appointment_scheduler.reschedule_reminder(appointment_id)
        
        # Send reschedule notification
        try:
            message = f"""📅 *Appointment Rescheduled* 📅

Hello {appointment.user.name}!

Your appointment has been rescheduled:

*Previous:*
📅 {old_date.strftime('%A, %B %d, %Y')}
⏰ {old_time.strftime('%I:%M %p')}

*New Schedule:*
📅 {new_date.strftime('%A, %B %d, %Y')}
⏰ {new_time.strftime('%I:%M %p')}
💄 Service: {appointment.service.name}

We apologize for any inconvenience. Looking forward to seeing you!

*Beauty Palace Team* 💕"""

            whatsapp_service.send_message(appointment.user.phone, message)
            
        except Exception as e:
            print(f"Failed to send reschedule notification: {str(e)}")
        
        return jsonify({
            'message': 'Appointment rescheduled successfully',
            'appointment': appointment.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/send-reminder/<int:appointment_id>', methods=['POST'])
def send_manual_reminder(appointment_id):
    """Send manual reminder for appointment"""
    try:
        appointment = Appointment.query.get_or_404(appointment_id)
        
        if appointment.status != 'upcoming':
            return jsonify({'error': 'Can only send reminders for upcoming appointments'}), 400
        
        success = whatsapp_service.send_appointment_reminder(
            client_name=appointment.user.name,
            client_phone=appointment.user.phone,
            service_name=appointment.service.name,
            appointment_date=appointment.appointment_date,
            appointment_time=appointment.appointment_time
        )
        
        if success:
            return jsonify({'message': 'Reminder sent successfully'})
        else:
            return jsonify({'error': 'Failed to send reminder'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
