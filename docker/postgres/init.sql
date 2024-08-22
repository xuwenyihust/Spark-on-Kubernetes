CREATE USER server WITH PASSWORD 'password-server';

CREATE DATABASE server_db;

\c server_db

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE notebooks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(100) NOT NULL,
    user_id INT REFERENCES users(id)
);

CREATE TABLE directories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(100) NOT NULL,
    user_id INT REFERENCES users(id)
);

CREATE TABLE spark_apps (
    spark_app_id VARCHAR(100) PRIMARY KEY,
    notebook_id INT REFERENCES notebooks(id),
    user_id INT REFERENCES users(id),
    status VARCHAR(100),
    created_at TIMESTAMP
);

CREATE TABLE spark_app_config (
    id SERIAL PRIMARY KEY,
    notebook_id INT REFERENCES notebooks(id),
    driver_memory VARCHAR(100),
    driver_memory_overhead VARCHAR(100),
    driver_cores INT,
    executor_memory VARCHAR(100),
    executor_memory_overhead VARCHAR(100),
    executor_memory_fraction FLOAT,
    executor_cores INT,
    executor_instances INT,
    dynamic_allocation_enabled BOOLEAN,
    executor_instances_min INT,
    executor_instances_max INT,
    shuffle_service_enabled BOOLEAN,
    executor_idle_timeout INT,
    queue VARCHAR(100)
);

GRANT ALL PRIVILEGES ON TABLE users TO server;
GRANT ALL PRIVILEGES ON SEQUENCE users_id_seq TO server;

GRANT ALL PRIVILEGES ON TABLE notebooks TO server;
GRANT ALL PRIVILEGES ON SEQUENCE notebooks_id_seq TO server;

GRANT ALL PRIVILEGES ON TABLE directories TO server;
GRANT ALL PRIVILEGES ON SEQUENCE directories_id_seq TO server;

GRANT ALL PRIVILEGES ON TABLE spark_apps TO server;

GRANT ALL PRIVILEGES ON TABLE spark_app_config TO server;

-- Add some initial data
-- user_0 -12345A
INSERT INTO users (name, password_hash, email) VALUES 
('user_0', 'scrypt:32768:8:1$1k6HpQA8N58PkDz7$db383b0d69d7a2f6893116b1955da70cb217173dc44ce169acf57cfe6a79f63118ad7515563a0b4f8f39dda49510d061acdba26be8f7c8786c161dd54d7a91c1', 'user_0@gmail.com'),
('user_1', 'pbkdf2:sha256:150000$3Z6Z6Z6Z$e3', 'user_1@gmail.com');

INSERT INTO notebooks (name, path, user_id) VALUES 
('demo.ipynb', 'work/user_0@gmail.com/demo.ipynb', 1),
('notebook.ipynb', 'work/user_0@gmail.com/notebook.ipynb', 1),
('quickstart.ipynb', 'work/user_0@gmail.com/quickstart.ipynb', 1),
('sg-resale-flat-prices.ipynb', 'work/user_0@gmail.com/sg-resale-flat-prices/sg-resale-flat-prices.ipynb', 1);

INSERT INTO directories (name, path, user_id) VALUES 
('user_0@gmail.com', '/work/user_0@gmail.com', 1),
('word-count', '/work/user_0@gmail.com/word-count', 1),
('sg-resale-flat-prices', '/work/user_0@gmail.com/sg-resale-flat-prices', 1),
('output', '/work/user_0@gmail.com/sg-resale-flat-prices/output', 1),
('user_1@gmail.com', '/work/user_0@gmail.com', 1);

