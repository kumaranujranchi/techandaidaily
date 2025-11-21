-- Admin Authentication & Enhanced Features Schema
-- Run this in phpMyAdmin after selecting your database

-- Admin users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add SEO and thumbnail columns to articles table
ALTER TABLE articles 
    ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70),
    ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160),
    ADD COLUMN IF NOT EXISTS meta_keywords VARCHAR(255),
    ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
    ADD COLUMN IF NOT EXISTS og_image VARCHAR(255),
    ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(255);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_slug ON articles(slug);

-- Insert default admin user (username: admin, password: admin123)
-- Password hash for 'admin123' using PASSWORD_BCRYPT
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@techandaidaily.com')
ON DUPLICATE KEY UPDATE username=VALUES(username);
