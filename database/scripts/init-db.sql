-- Create a non-superuser role for the application (change password - both here and in .env)
CREATE USER app_user WITH PASSWORD 'app_password';

-- Create the application schema
CREATE SCHEMA IF NOT EXISTS setoalt AUTHORIZATION app_user;

-- Grant necessary privileges to the app_user
GRANT CONNECT ON DATABASE setoalt TO app_user;
GRANT USAGE ON SCHEMA setoalt TO app_user;
GRANT CREATE ON SCHEMA setoalt TO app_user;

-- Grant table and sequence privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA setoalt TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA setoalt TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA setoalt GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA setoalt GRANT USAGE, SELECT ON SEQUENCES TO app_user;

-- Create necessary tables for the application
CREATE TABLE IF NOT EXISTS setoalt.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    role VARCHAR(255) NOT NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_by VARCHAR(255),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS setoalt.scores
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    recording VARCHAR(255),
    data JSON NOT NULL,
    default_tempo INTEGER,
    default_transposition INTEGER,
    text TEXT,
    visibility VARCHAR(255) NOT NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modified_by VARCHAR(255),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_by VARCHAR(255),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS setoalt.notifications
(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    message TEXT,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_to TIMESTAMP WITH TIME ZONE
);