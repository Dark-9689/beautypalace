from supabase import create_client, Client
from flask import current_app, g
import os

supabase: Client = None

def init_supabase(app):
    global supabase
    with app.app_context():
        supabase_url = app.config['SUPABASE_URL']
        supabase_key = app.config['SUPABASE_SERVICE_KEY']
        
        if not supabase_url or not supabase_key:
            raise ValueError("Supabase URL and Service Key must be provided")
        
        supabase = create_client(supabase_url, supabase_key)
        app.supabase = supabase

def get_supabase() -> Client:
    if 'supabase' not in g:
        g.supabase = current_app.supabase
    return g.supabase

def get_user_supabase(access_token: str) -> Client:
    """Get Supabase client with user's access token for RLS"""
    supabase_url = current_app.config['SUPABASE_URL']
    supabase_key = current_app.config['SUPABASE_ANON_KEY']
    
    client = create_client(supabase_url, supabase_key)
    client.auth.set_session(access_token, None)
    return client
