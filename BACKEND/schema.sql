CREATE DATABASE IF NOT EXISTS turfzone_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE turfzone_db;

CREATE TABLE IF NOT EXISTS users (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    full_name   VARCHAR(100)    NOT NULL,
    email       VARCHAR(150)    NOT NULL UNIQUE,    
    password    VARCHAR(255)    NOT NULL,              
    created_at  DATETIME        DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS turfs (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    turf_name           VARCHAR(100)    NOT NULL,
    sports_available    VARCHAR(500)    NOT NULL,       
    price_per_hour      DOUBLE          NOT NULL,
    rating              DOUBLE          DEFAULT 0.0,
    location            VARCHAR(200),
    image_url           VARCHAR(1000),
    created_at          DATETIME        DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bookings (
    booking_id      BIGINT          NOT NULL AUTO_INCREMENT,
    user_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL,
    turf_id         BIGINT          NOT NULL,
    booking_date    DATE            NOT NULL,
    booking_time    TIME            NOT NULL,
    created_at      DATETIME        DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (booking_id),
    CONSTRAINT fk_booking_turf FOREIGN KEY (turf_id) REFERENCES turfs(id) ON DELETE CASCADE,
    INDEX idx_bookings_email (email),
    INDEX idx_bookings_turf_id (turf_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO turfs (turf_name, sports_available, price_per_hour, rating, location)
VALUES
    ('Implecity Turf',    'Cricket,Football,Badminton',                                     800.0,  4.5, 'Nilakkottai, Dindigul'),
    ('Indoor Battle Turf','Cricket,Football',                                                500.0,  3.9, 'Batlagundu, Dindigul'),
    ('Learn Fort',        'Cricket,Football,Badminton,Basketball,Tennis,Volleyball',         1000.0, 4.8, 'Batlagundu, Dindigul');

SELECT * FROM turfs;
SELECT COUNT(*) AS total_turfs FROM turfs;
