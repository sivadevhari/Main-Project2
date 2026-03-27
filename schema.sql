-- SQLite schema for replacing JSON files

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL
);

-- Diagnostics table
CREATE TABLE IF NOT EXISTS diagnostics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_email TEXT,
    user_name TEXT,
    address TEXT,
    symptoms TEXT,
    disease TEXT,
    accuracy TEXT,
    timestamp TEXT
);

-- Disease info table
CREATE TABLE IF NOT EXISTS disease_info (
    name TEXT PRIMARY KEY,
    description TEXT,
    causes TEXT,
    precautions TEXT,
    image TEXT
);
