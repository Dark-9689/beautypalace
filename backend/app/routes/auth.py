from flask import Blueprint, request, jsonify
from app.utils.supabase_client import get_supabase
from app.utils.auth_helpers import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        phone = data.get('phone')
        
        if not all([email, password, name]):
            return jsonify({'error': 'Email, password, and name are required'}), 400
        
        supabase = get_supabase()
        
        # Sign up user with Supabase Auth
        auth_response = supabase.auth.sign_up({
            'email': email,
            'password': password,
            'options': {
                'data': {
                    'name': name,
                    'phone': phone
                }
            }
        })
        
        if auth_response.user:
            return jsonify({
                'message': 'User created successfully',
                'user': {
                    'id': auth_response.user.id,
                    'email': auth_response.user.email,
                    'name': name
                }
            }), 201
        else:
            return jsonify({'error': 'Failed to create user'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        supabase = get_supabase()
        
        # Sign in with Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            'email': email,
            'password': password
        })
        
        if auth_response.user and auth_response.session:
            # Get user profile
            profile_response = supabase.table('profiles').select('*').eq('id', auth_response.user.id).execute()
            
            profile = profile_response.data[0] if profile_response.data else {}
            
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': auth_response.user.id,
                    'email': auth_response.user.email,
                    'name': profile.get('name'),
                    'phone': profile.get('phone'),
                    'is_admin': profile.get('is_admin', False)
                },
                'access_token': auth_response.session.access_token,
                'refresh_token': auth_response.session.refresh_token
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user_id):
    try:
        supabase = get_supabase()
        
        result = supabase.table('profiles').select('*').eq('id', current_user_id).execute()
        
        if result.data:
            profile = result.data[0]
            return jsonify({
                'user': {
                    'id': profile['id'],
                    'name': profile['name'],
                    'phone': profile['phone'],
                    'is_admin': profile['is_admin'],
                    'created_at': profile['created_at']
                }
            }), 200
        else:
            return jsonify({'error': 'Profile not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user_id):
    try:
        data = request.get_json()
        supabase = get_supabase()
        
        # Update profile
        result = supabase.table('profiles').update({
            'name': data.get('name'),
            'phone': data.get('phone')
        }).eq('id', current_user_id).execute()
        
        if result.data:
            return jsonify({
                'message': 'Profile updated successfully',
                'user': result.data[0]
            }), 200
        else:
            return jsonify({'error': 'Failed to update profile'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
