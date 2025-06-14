from app import db
from datetime import datetime

class Offer(db.Model):
    __tablename__ = 'offers'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    discount_percentage = db.Column(db.Float, nullable=False)
    valid_until = db.Column(db.Date, nullable=False)
    terms = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'discount_percentage': self.discount_percentage,
            'valid_until': self.valid_until.isoformat(),
            'terms': self.terms,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }
