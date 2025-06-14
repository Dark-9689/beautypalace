from flask import Blueprint, request, jsonify
from app.utils.supabase_client import get_supabase
from app.utils.auth_helpers import admin_required
from datetime import date

offers_bp = Blueprint('offers', __name__)

@offers_bp.route('', methods=['GET'])
def get_active_offers():
    try:
        supabase = get_supabase()
        
        today = date.today().isoformat()
        
        result = supabase.table('offers').select('*').eq('is_active', True).gte('valid_until', today).order('created_at', desc=True).execute()
        
        return jsonify({
            'offers': result.data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offers_bp.route('/all', methods=['GET'])
@admin_required
def get_all_offers(current_user_id):
    try:
        supabase = get_supabase()
        
        result = supabase.table('offers').select('*').order('created_at', desc=True).execute()
        
        return jsonify({
            'offers': result.data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offers_bp.route('', methods=['POST'])
@admin_required
def create_offer(current_user_id):
    try:
        data = request.get_json()
        supabase = get_supabase()
        
        result = supabase.table('offers').insert({
            'title': data.get('title'),
            'description': data.get('description'),
            'discount_percentage': data.get('discount_percentage'),
            'valid_until': data.get('valid_until'),
            'terms': data.get('terms', '')
        }).execute()
        
        if result.data:
            return jsonify({
                'message': 'Offer created successfully',
                'offer': result.data[0]
            }), 201
        else:
            return jsonify({'error': 'Failed to create offer'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offers_bp.route('/<offer_id>', methods=['PUT'])
@admin_required
def update_offer(current_user_id, offer_id):
    try:
        data = request.get_json()
        supabase = get_supabase()
        
        result = supabase.table('offers').update({
            'title': data.get('title'),
            'description': data.get('description'),
            'discount_percentage': data.get('discount_percentage'),
            'valid_until': data.get('valid_until'),
            'terms': data.get('terms'),
            'is_active': data.get('is_active', True)
        }).eq('id', offer_id).execute()
        
        if result.data:
            return jsonify({
                'message': 'Offer updated successfully',
                'offer': result.data[0]
            }), 200
        else:
            return jsonify({'error': 'Offer not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@offers_bp.route('/<offer_id>', methods=['DELETE'])
@admin_required
def delete_offer(current_user_id, offer_id):
    try:
        supabase = get_supabase()
        
        result = supabase.table('offers').update({
            'is_active': False
        }).eq('id', offer_id).execute()
        
        if result.data:
            return jsonify({
                'message': 'Offer deleted successfully'
            }), 200
        else:
            return jsonify({'error': 'Offer not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
