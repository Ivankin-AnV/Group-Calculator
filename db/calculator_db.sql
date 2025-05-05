CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE Operands (
    operand_id BIGSERIAL PRIMARY KEY,
    value NUMERIC,
    is_unary BOOLEAN DEFAULT FALSE,
    is_variable BOOLEAN DEFAULT FALSE
);

CREATE TABLE Operations (
    operation_id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(5) NOT NULL UNIQUE,
    is_function BOOLEAN DEFAULT FALSE,
    precedence SMALLINT NOT NULL
);

CREATE TABLE History (
    history_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES Users(user_id) ON DELETE SET NULL,
    operand_id BIGINT REFERENCES Operands(operand_id) ON DELETE SET NULL,
    operation_id BIGINT REFERENCES Operations(operation_id) ON DELETE SET NULL,
    result NUMERIC,
    calculation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    device_info JSONB,
    error_message TEXT,
    metadata JSONB,
    session_id UUID DEFAULT uuid_generate_v4()
);
