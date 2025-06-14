-- Create database and user
CREATE DATABASE beauty_palace;
CREATE USER beauty_admin WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE beauty_palace TO beauty_admin;

-- Connect to the database
\c beauty_palace;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO beauty_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO beauty_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO beauty_admin;

-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(128),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    service_id INTEGER REFERENCES services(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'upcoming',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    service_name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE review_images (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    discount_percentage DECIMAL(5,2) NOT NULL,
    valid_until DATE NOT NULL,
    terms TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO services (name, description, price, duration, image_url) VALUES
('Signature Haircut', 'Personalized cut and styling that complements your unique features', 60.00, 60, 'https://ik.imagekit.io/beautypalace/services/haircut.jpg'),
('Luxury Facial', 'Deep cleansing and rejuvenating treatment for radiant skin', 85.00, 75, 'https://ik.imagekit.io/beautypalace/services/facial.jpg'),
('Hair Transformation', 'Complete hair makeover with smoothing treatment', 120.00, 120, 'https://ik.imagekit.io/beautypalace/services/smoothing.jpg'),
('Keratin Therapy', 'Professional treatment for stronger, healthier hair', 150.00, 150, 'https://ik.imagekit.io/beautypalace/services/keratin.jpg'),
('Smooth Skin', 'Professional waxing services for silky smooth results', 40.00, 30, 'https://ik.imagekit.io/beautypalace/services/waxing.jpg'),
('Glamour Makeup', 'Professional makeup artistry for special occasions', 75.00, 60, 'https://ik.imagekit.io/beautypalace/services/makeup.jpg');

INSERT INTO offers (title, description, discount_percentage, valid_until, terms) VALUES
('New Client Special', 'Get 20% off your first visit to Beauty Palace', 20.00, '2024-12-31', 'Valid for first-time clients only'),
('Bridal Package', 'Complete bridal makeover including hair, makeup, and skincare', 30.00, '2025-01-15', 'Book 2 weeks in advance'),
('Weekend Wellness', 'Facial + Hair treatment combo every Saturday & Sunday', 25.00, '2024-12-31', 'Weekends only');

-- Create admin user
INSERT INTO users (name, email, phone, is_admin) VALUES
('Admin User', 'admin@beautypalace.com', '9876543210', TRUE);

-- Create indexes for better performance
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_offers_active_valid ON offers(is_active, valid_until);
