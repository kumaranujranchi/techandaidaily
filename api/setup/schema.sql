-- Tech & AI Daily Database Schema
-- For Hostinger Shared Hosting
-- Import this via phpMyAdmin after selecting your database

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    role VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    category ENUM('News', 'Deep Dive', 'Tutorial', 'Opinion', 'Research') NOT NULL,
    author_id VARCHAR(50) NOT NULL,
    published_at DATETIME NOT NULL,
    image_url VARCHAR(255),
    read_time_minutes INT DEFAULT 5,
    is_top_story TINYINT(1) DEFAULT 0,
    ai_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_published_at (published_at),
    INDEX idx_is_top_story (is_top_story)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article-Tags relationship (many-to-many)
CREATE TABLE IF NOT EXISTS article_tags (
    article_id VARCHAR(50) NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (article_id, tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign keys after tables are created
ALTER TABLE articles 
    ADD CONSTRAINT fk_articles_author 
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE;

ALTER TABLE article_tags 
    ADD CONSTRAINT fk_article_tags_article 
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE;

ALTER TABLE article_tags 
    ADD CONSTRAINT fk_article_tags_tag 
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;

-- Insert default authors
INSERT INTO authors (id, name, avatar_url, role) VALUES
('sarah', 'Sarah Mitchell', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', 'Senior AI Correspondent'),
('david', 'David Park', 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', 'Technology Editor'),
('emma', 'Emma Chen', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', 'Research Analyst')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert sample article
INSERT INTO articles (id, title, summary, content, category, author_id, published_at, image_url, read_time_minutes, is_top_story) VALUES
(
    '1',
    'OpenAI Unveils GPT-5: The Dawn of Human-Level AI',
    'OpenAI''s latest model demonstrates unprecedented reasoning capabilities, sparking both excitement and concern across the tech industry.',
    '<p>In a groundbreaking announcement today, OpenAI revealed GPT-5, their most advanced language model to date. The new system demonstrates reasoning capabilities that researchers describe as approaching human-level performance across a wide range of cognitive tasks.</p><h3>Key Capabilities</h3><p>GPT-5 introduces several revolutionary features including real-time learning, multi-modal understanding, and enhanced contextual awareness. Early benchmarks show the model outperforming previous versions by significant margins.</p><blockquote>"This represents a fundamental leap forward in artificial intelligence," said Sam Altman, CEO of OpenAI.</blockquote><p>The release has reignited debates about AI safety and regulation, with experts calling for careful oversight as these systems become increasingly powerful.</p>',
    'News',
    'sarah',
    NOW(),
    'https://picsum.photos/seed/ai1/800/600',
    8,
    1
)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Insert sample tags
INSERT INTO tags (name) VALUES 
('AI'), ('GPT'), ('OpenAI'), ('Machine Learning'), ('Technology')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Link tags to sample article
INSERT INTO article_tags (article_id, tag_id) 
SELECT '1', id FROM tags WHERE name IN ('AI', 'GPT', 'OpenAI')
ON DUPLICATE KEY UPDATE article_id=VALUES(article_id);
