-- Device Sandbox Simulator Database Schema
-- Optimized for MySQL 8.0+

-- Create database
CREATE DATABASE IF NOT EXISTS device_sandbox
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE device_sandbox;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS presets;
DROP TABLE IF EXISTS devices;

-- =====================================================
-- DEVICES TABLE
-- Stores the current device on canvas (single device)
-- =====================================================
CREATE TABLE devices (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type ENUM('light', 'fan') NOT NULL COMMENT 'Device type',
    settings JSON NOT NULL COMMENT 'Device-specific settings',
    position_x SMALLINT NOT NULL DEFAULT 0 COMMENT 'X coordinate on canvas',
    position_y SMALLINT NOT NULL DEFAULT 0 COMMENT 'Y coordinate on canvas',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better query performance
    INDEX idx_type (type),
    INDEX idx_updated_at (updated_at),
    
    -- Constraints
    CONSTRAINT chk_position_x CHECK (position_x >= 0 AND position_x <= 10000),
    CONSTRAINT chk_position_y CHECK (position_y >= 0 AND position_y <= 10000),
    CONSTRAINT chk_settings_valid CHECK (JSON_VALID(settings))
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci
COMMENT='Stores current active device on canvas';

-- =====================================================
-- PRESETS TABLE
-- Stores saved device configurations
-- =====================================================
CREATE TABLE presets (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Preset name given by user',
    device_type ENUM('light', 'fan') NOT NULL COMMENT 'Type of device in preset',
    device_settings JSON NOT NULL COMMENT 'Complete device configuration',
    position_x SMALLINT NOT NULL DEFAULT 0 COMMENT 'Saved X coordinate',
    position_y SMALLINT NOT NULL DEFAULT 0 COMMENT 'Saved Y coordinate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_name (name),
    INDEX idx_device_type (device_type),
    INDEX idx_created_at (created_at),
    
    -- Full-text search for preset names (bonus feature)
    FULLTEXT INDEX ft_name (name),
    
    -- Constraints
    CONSTRAINT chk_name_length CHECK (CHAR_LENGTH(name) BETWEEN 1 AND 100),
    CONSTRAINT chk_preset_position_x CHECK (position_x >= 0 AND position_x <= 10000),
    CONSTRAINT chk_preset_position_y CHECK (position_y >= 0 AND position_y <= 10000),
    CONSTRAINT chk_preset_settings_valid CHECK (JSON_VALID(device_settings))
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci
COMMENT='Stores user-saved device presets';

-- =====================================================
-- SAMPLE DATA (for testing)
-- =====================================================

-- Insert sample presets
INSERT INTO presets (name, device_type, device_settings, position_x, position_y) VALUES
('Light 3', 'light', '{"power": true, "colorTemp": "warm", "brightness": 75}', 640, 350),
('Light 4', 'light', '{"power": true, "colorTemp": "cool", "brightness": 90}', 640, 350),
('Fan 5', 'fan', '{"power": true, "speed": 50}', 640, 350),
('Fan 6', 'fan', '{"power": true, "speed": 80}', 640, 350),
('Fan 7', 'fan', '{"power": true, "speed": 30}', 640, 350);

-- =====================================================
-- USEFUL QUERIES (for reference)
-- =====================================================

-- Get current device on canvas
-- SELECT * FROM devices ORDER BY updated_at DESC LIMIT 1;

-- Get all presets ordered by creation date
-- SELECT id, name, device_type, device_settings, position_x, position_y, created_at 
-- FROM presets ORDER BY created_at DESC;

-- Search presets by name
-- SELECT * FROM presets WHERE name LIKE '%fan%';

-- Get preset by ID
-- SELECT * FROM presets WHERE id = ?;

-- Count presets by type
-- SELECT device_type, COUNT(*) as count FROM presets GROUP BY device_type;

-- Delete old devices (keep only latest)
-- DELETE FROM devices WHERE id NOT IN (SELECT id FROM (SELECT id FROM devices ORDER BY updated_at DESC LIMIT 1) AS temp);

-- =====================================================
-- PERFORMANCE OPTIMIZATION
-- =====================================================

-- Check JSON path exists in settings (example)
-- SELECT * FROM devices WHERE JSON_CONTAINS_PATH(settings, 'one', '$.power');

-- Extract specific JSON value (example)
-- SELECT id, type, JSON_EXTRACT(settings, '$.brightness') as brightness FROM devices;

-- =====================================================
-- DATABASE MAINTENANCE
-- =====================================================

-- Analyze tables for optimization
ANALYZE TABLE devices, presets;

-- Check table status
-- SHOW TABLE STATUS LIKE 'devices';
-- SHOW TABLE STATUS LIKE 'presets';