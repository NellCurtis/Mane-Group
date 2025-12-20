-- Add missing translation keys to the content table
-- This migration adds content entries that may be referenced in the application

-- Add contact form success message
INSERT INTO content (section, key, englishText, frenchText) VALUES
('contact', 'contactSuccessMessage', 'Message sent successfully! We will get back to you soon.', 'Message envoyé avec succès ! Nous vous répondrons bientôt.'),
('registration', 'registrationSuccessMessage', 'Thank you for your registration. We will contact you soon.', 'Merci pour votre inscription. Nous vous contacterons bientôt.')
ON CONFLICT (section, key) DO NOTHING;