CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE endpoints (
  id                 SERIAL PRIMARY KEY,
  user_id            INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nombre             VARCHAR(100) NOT NULL,
  url                TEXT NOT NULL,
  method             VARCHAR(4) NOT NULL DEFAULT 'GET',
  expected_status    SMALLINT NOT NULL DEFAULT 200,
  check_interval_min SMALLINT NOT NULL DEFAULT 5,
  is_public          BOOLEAN NOT NULL DEFAULT false,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE checks (
  id               SERIAL PRIMARY KEY,
  endpoint_id      INTEGER NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
  status           VARCHAR(10) NOT NULL,
  response_time_ms INTEGER,
  http_status_code SMALLINT,
  checked_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE VIEW v_endpoint_status AS
SELECT DISTINCT ON (endpoint_id)
  endpoint_id, status, response_time_ms, http_status_code, checked_at
FROM checks
ORDER BY endpoint_id, checked_at DESC;

CREATE TABLE ai_diagnoses (
  id               SERIAL PRIMARY KEY,
  endpoint_id      INTEGER NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
  check_id         INTEGER NOT NULL REFERENCES checks(id) ON DELETE CASCADE,
  severity         VARCHAR(20) NOT NULL,
  diagnosis        TEXT NOT NULL,
  recommendation   TEXT,
  model_used       VARCHAR(50),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
