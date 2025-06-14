from app import create_app
from flask import jsonify
import os

app = create_app()

@app.route('/')
def index():
    return jsonify({
        'message': 'Beauty Palace API is running!',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth',
            'appointments': '/api/appointments',
            'services': '/api/services',
            'reviews': '/api/reviews',
            'offers': '/api/offers',
            'whatsapp': '/api/whatsapp'
        }
    })

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'database': 'connected'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
