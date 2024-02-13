CREATE SCHEMA IF NOT EXISTS setoalt;

CREATE TABLE IF NOT EXISTS setoalt.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS setoalt.scores
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    data JSON NOT NULL,
    default_tempo INTEGER,
    text TEXT,
    visibility VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES setoalt.users(id) ON DELETE SET NULL
);
