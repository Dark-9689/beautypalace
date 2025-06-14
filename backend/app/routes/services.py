from flask import Blueprint, request, jsonify
from app.utils.supabase_client import get_supabase
from app.utils.auth_helpers import admin_required

services_bp = Blueprint('services', __name__)

@services_bp.route('', methods=['GET'])
def get_services():
    try:
        supabase = get_supabase()
        
        result = supabase.table('services').select('*').eq('is_active', True).order('created_at').execute()
        
        return jsonify({
            'services': result.data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@services_bp.route('/<service_id>', methods=['GET'])
def get_service(service_id):
    try:
        supabase = get_supabase()
        
        result = supabase.table('services').select('*').eq('id', service_id).eq('is_active', True).execute()
        
        if result.data:
            return jsonify({
                'service': result.data[0]
            }), 200
        else:
            return jsonify({'error': 'Service not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@services_bp.route('', methods=['POST'])
@admin_required
def create_service(current_user_id):
    try:
        data = request.get_json()
        supabase = get_supabase()
        
        result = supabase.table('services').insert({
            'name': data.get('name'),
            'description': data.get('description'),
            'price': data.get('price'),
            'duration': data.get('duration'),
            'image_url': data.get('image_url')
        }).execute()
        
        if result.data:
            return jsonify({
                'message': 'Service created successfully',
                'service': result.data[0]
            }), 201
        else:
            return jsonify({'error': 'Failed to create service'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@services_bp.route('/<service_id>', methods=['PUT'])
@admin_required
def update_service(current_user_id, service_id):
    try:
        data = request.get_json()
        supabase = get_supabase()
        
        result = supabase.table('services').update({
            'name': data.get('name'),
            'description': data.get('description'),
            'price': data.get('price'),
            'duration': data.get('duration'),
            'image_url': data.get('image_url'),
            'is_active': data.get('is_active', True)
        }).eq('id', service_id).execute()
        
        if result.data:
            return jsonify({
                'message': 'Service updated successfully',
                'service': result.data[0]
            }), 200
        else:
            return jsonify({'error': 'Service not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@services_bp.route('/<service_id>', methods=['DELETE'])
@admin_required
def delete_service(current_user_id, service_id):
    try:
        supabase = get_supabase()
        
        # Soft delete by setting is_active to False
        result = supabase.table('services').update({
            'is_active': False
        }).eq('id', service_id).execute()
        
        if result.data:
            return jsonify({
                'message': 'Service deleted successfully'
            }), 200
        else:
            return jsonify({'error': 'Service not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
