from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import config
from app.utils.supabase_client import init_supabase
import os

jwt = JWTManager()

def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    jwt.init_app(app)
    CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000'])
    
    # Initialize Supabase
    init_supabase(app)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.appointments import appointments_bp
    from app.routes.services import services_bp
    from app.routes.reviews import reviews_bp
    from app.routes.offers import offers_bp
    from app.routes.whatsapp import whatsapp_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(appointments_bp, url_prefix='/api/appointments')
    app.register_blueprint(services_bp, url_prefix='/api/services')
    app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
    app.register_blueprint(offers_bp, url_prefix='/api/offers')
    app.register_blueprint(whatsapp_bp, url_prefix='/api/whatsapp')
    
    return app
