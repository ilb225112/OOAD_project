-- WARNING: seed data only, do not use in production
use auction_system_ooad;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('AUCTIONEER', 'BIDDER') NOT NULL
);

CREATE TABLE IF NOT EXISTS auctions (
    auction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
	auction_type ENUM('CRICKET', 'ANTIQUES', 'REAL_ESTATE', 'KABADDI') NOT NULL,
    auction_date DATETIME NOT NULL 
);

CREATE TABLE IF NOT EXISTS items (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    auction_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    starting_price DECIMAL(10,2) NOT NULL,
    status ENUM('AVAILABLE', 'SOLD') NOT NULL,
    winner_bidder_id BIGINT NULL,
    FOREIGN KEY (auction_id) REFERENCES auctions(auction_id) ON DELETE CASCADE,
    FOREIGN KEY (winner_bidder_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS bids (
    bid_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    auction_id BIGINT NOT NULL,
    bidder_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    bid_amount DECIMAL(10,2) NOT NULL,
    bid_time DATETIME NOT NULL,
    FOREIGN KEY (auction_id) REFERENCES auctions(auction_id) ON DELETE CASCADE,
    FOREIGN KEY (bidder_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bidders_registration (
    registration_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    auction_id BIGINT NOT NULL,
    bidder_id BIGINT NOT NULL,
    FOREIGN KEY (auction_id) REFERENCES auctions(auction_id) ON DELETE CASCADE,
    FOREIGN KEY (bidder_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- Insert Users (Auctioneers and Bidders) - Use INSERT IGNORE to skip duplicates
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin User', 'admin@auction.com', 'admin123', 'AUCTIONEER'),
('John Doe', 'john@example.com', 'pass123', 'AUCTIONEER'),
('Alice Smith', 'alice@example.com', 'pass123', 'BIDDER'),
('Bob Johnson', 'bob@example.com', 'pass123', 'BIDDER');

INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin User', 'admin@auction.com', 'admin123', 'AUCTIONEER'),

-- Insert Auctions (Conducted by Auctioneers) - Use INSERT IGNORE to skip duplicates
INSERT IGNORE INTO auctions (name, auction_type, auction_date) VALUES
('Chompions trophy 2025', 'CRICKET', '2025-03-31 14:00:00'),
('Antiques on sales', 'ANTIQUES', '2025-06-01 15:00:00');

-- Insert Items (Associated with Auctions) - Use INSERT IGNORE to skip duplicates
INSERT IGNORE INTO items (auction_id, name, description, starting_price, status, winner_bidder_id) VALUES
(1, 'Shikar Dhawan', 'Left handed batsman', 100000.00, 'AVAILABLE', NULL),
(2, 'Vintage Watch', 'Rare 1920s vintage watch', 5000.00, 'AVAILABLE', NULL);

-- Insert Bidders Registration (Users registering for Auctions) - Use INSERT IGNORE to skip duplicates
INSERT IGNORE INTO bidders_registration (auction_id, bidder_id) VALUES
(1, 2), -- Alice registers for Cricket auction
(2, 3); -- Bob registers for Antiques auction

-- Insert Bids (Users placing bids on Items in Auctions) - Use INSERT IGNORE to skip duplicates
INSERT IGNORE INTO bids (auction_id, bidder_id, item_id, bid_amount, bid_time) VALUES
(1, 2, 1, 1200.00, '2024-03-31 14:05:00'), -- Alice bids on Cricket Bat
(2, 3, 2, 5500.00, '2024-04-01 15:10:00'); -- Bob bids on Vintage Watch
