from flask import Blueprint, request, jsonify
from app.utils.supabase_client import get_supabase
from app.utils.auth_helpers import token_required, admin_required
from app.utils.whatsapp import WhatsAppService
from datetime import datetime, date, time

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('', methods=['GET'])
@admin_required
def get_all_appointments(current_user_id):
    try:
        supabase = get_supabase()
        
        # Get appointments with user and service details
        result = supabase.table('appointments').select('''
            *,
            profiles:user_id(name, phone),
            services:service_id(name, duration, price)
        ''').order('appointment_date', desc=False).order('appointment_time', desc=False).execute()
        
        return jsonify({
            'appointments': result.data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/my', methods=['GET'])
@token_required
def get_user_appointments(current_user_id):
    try:
        supabase = get_supabase()
        
        result = supabase.table('appointments').select('''
            *,
            services:service_id(name, duration, price)
        ''').eq('user_id', current_user_id).order('appointment_date', desc=False).execute()
        
        return jsonify({
            'appointments': result.data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('', methods=['POST'])
@token_required
def create_appointment(current_user_id):
    try:
        data = request.get_json()
        supabase = get_supabase()
        
        # Validate required fields
        required_fields = ['service_id', 'appointment_date', 'appointment_time']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if service exists
        service_result = supabase.table('services').select('*').eq('id', data['service_id']).eq('is_active', True).execute()
        if not service_result.data:
            return jsonify({'error': 'Service not found'}), 404
        
        service = service_result.data[0]
        
        # Create appointment
        result = supabase.table('appointments').insert({
            'user_id': current_user_id,
            'service_id': data['service_id'],
            'appointment_date': data['appointment_date'],
            'appointment_time': data['appointment_time'],
            'notes': data.get('notes', '')
        }).execute()
        
        if result.data:
            appointment = result.data[0]
            
            # Get user details for WhatsApp notification
            user_result = supabase.table('profiles').select('*').eq('id', current_user_id).execute()
            user = user_result.data[0] if user_result.data else {}
            
            # Send WhatsApp notifications
            try:
                whatsapp = WhatsAppService()
                
                # Send confirmation to user
                if user.get('phone'):
                    whatsapp.send_booking_confirmation(
                        user['phone'],
                        user['name'],
                        service['name'],
                        data['appointment_date'],
                        data['appointment_time']
                    )
                
                # Send notification to owner
                whatsapp.send_owner_notification(
                    user['name'],
                    user.get('phone', 'N/A'),
                    service['name'],
                    data['appointment_date'],
                    data['appointment_time']
                )
                
            except Exception as whatsapp_error:
                print(f"WhatsApp notification error: {whatsapp_error}")
            
            return jsonify({
                'message': 'Appointment created successfully',
                'appointment': appointment
            }), 201
        else:
            return jsonify({'error': 'Failed to create appointment'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/<appointment_id>/status', methods=['PUT'])
@admin_required
def update_appointment_status(current_user_id, appointment_id):
    try:
        data = request.get_json()
        status = data.get('status')
        
        if status not in ['upcoming', 'completed', 'cancelled']:
            return jsonify({'error': 'Invalid status'}), 400
        
        supabase = get_supabase()
        
        result = supabase.table('appointments').update({
            'status': status
        }).eq('id', appointment_id).execute()
        
        if result.data:
            return jsonify({
                'message': 'Appointment status updated successfully',
                'appointment': result.data[0]
            }), 200
        else:
            return jsonify({'error': 'Appointment not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/<appointment_id>', methods=['DELETE'])
@token_required
def cancel_appointment(current_user_id, appointment_id):
    try:
        supabase = get_supabase()
        
        # Check if appointment belongs to user or user is admin
        appointment_result = supabase.table('appointments').select('*').eq('id', appointment_id).execute()
        
        if not appointment_result.data:
            return jsonify({'error': 'Appointment not found'}), 404
        
        appointment = appointment_result.data[0]
        
        # Check if user owns the appointment or is admin
        if appointment['user_id'] != current_user_id:
            user_result = supabase.table('profiles').select('is_admin').eq('id', current_user_id).execute()
            if not user_result.data or not user_result.data[0]['is_admin']:
                return jsonify({'error': 'Unauthorized'}), 403
        
        # Update status to cancelled
        result = supabase.table('appointments').update({
            'status': 'cancelled'
        }).eq('id', appointment_id).execute()
        
        if result.data:
            return jsonify({
                'message': 'Appointment cancelled successfully'
            }), 200
        else:
            return jsonify({'error': 'Failed to cancel appointment'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
