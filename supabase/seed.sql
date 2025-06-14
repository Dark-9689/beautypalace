-- Insert sample services
INSERT INTO public.services (name, description, price, duration, image_url) VALUES
('Signature Haircut', 'Personalized cut and styling that complements your unique features', 60.00, 60, '/images/haircut.jpg'),
('Luxury Facial', 'Deep cleansing and rejuvenating treatment for radiant skin', 85.00, 75, '/images/facial.jpg'),
('Hair Transformation', 'Complete hair makeover with smoothing treatment', 120.00, 120, '/images/smoothing.jpg'),
('Keratin Therapy', 'Professional treatment for stronger, healthier hair', 150.00, 150, '/images/keratin.jpg'),
('Smooth Skin', 'Professional waxing services for silky smooth results', 40.00, 30, '/images/waxing.jpg'),
('Glamour Makeup', 'Professional makeup artistry for special occasions', 75.00, 60, '/images/makeup.jpg');

-- Insert sample offers
INSERT INTO public.offers (title, description, discount_percentage, valid_until, terms) VALUES
('New Client Special', 'Get 20% off your first visit to Beauty Palace', 20.00, '2024-12-31', 'Valid for first-time clients only'),
('Bridal Package', 'Complete bridal makeover including hair, makeup, and skincare', 30.00, '2025-01-15', 'Book 2 weeks in advance'),
('Weekend Wellness', 'Facial + Hair treatment combo every Saturday & Sunday', 25.00, '2024-12-31', 'Weekends only');

-- Create admin user (you'll need to sign up first, then update this)
-- UPDATE public.profiles SET is_admin = TRUE WHERE id = 'your-admin-user-id';
