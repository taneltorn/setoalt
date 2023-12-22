-- CREATE TABLE IF NOT EXISTS users
-- (
--     id       SERIAL PRIMARY KEY,
--     username VARCHAR(50) NOT NULL,
--     password VARCHAR(50) NOT NULL
-- );

CREATE SCHEMA IF NOT EXISTS setoalt;


CREATE TABLE IF NOT EXISTS setoalt.scores
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    data JSON NOT NULL,
    tempo INTEGER,
    text TEXT
);
