from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import config
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Create upload directories
    os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'reviews'), exist_ok=True)
    
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
    
    # Initialize scheduler
    with app.app_context():
        from app.utils.scheduler import appointment_scheduler
    
    return app
