CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS checkpoints (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  border_name VARCHAR(100),
  country VARCHAR(100),
  location TEXT,
  device_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role_id INTEGER REFERENCES roles(id),
  department_id INTEGER REFERENCES departments(id),
  checkpoint_id INTEGER REFERENCES checkpoints(id),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS travelers (
  id VARCHAR(50) PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  date_of_birth DATE,
  nationality VARCHAR(100),
  passport_number VARCHAR(100),
  passport_expiry DATE,
  photo TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devices (
  id VARCHAR(50) PRIMARY KEY,
  device_name VARCHAR(100) NOT NULL,
  device_type VARCHAR(50),
  serial_number VARCHAR(100),
  checkpoint_id INTEGER REFERENCES checkpoints(id),
  status VARCHAR(20) DEFAULT 'offline',
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  firmware_version VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS border_crossings (
  id VARCHAR(50) PRIMARY KEY,
  traveler_id VARCHAR(50) REFERENCES travelers(id),
  card_id VARCHAR(50) NOT NULL,
  officer_id INTEGER REFERENCES users(id),
  department_id INTEGER REFERENCES departments(id),
  checkpoint_id INTEGER REFERENCES checkpoints(id),
  direction VARCHAR(20) DEFAULT 'entry',
  status VARCHAR(20) DEFAULT 'pending',
  decision_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  decision_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  traveler_id VARCHAR(50) REFERENCES travelers(id),
  type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) DEFAULT 'warning',
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100),
  resource_id VARCHAR(100),
  ip_address VARCHAR(50),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  details JSONB
);

CREATE INDEX IF NOT EXISTS idx_travelers_card ON travelers(id);
CREATE INDEX IF NOT EXISTS idx_crossings_traveler ON border_crossings(traveler_id);
CREATE INDEX IF NOT EXISTS idx_crossings_checkpoint ON border_crossings(checkpoint_id);
CREATE INDEX IF NOT EXISTS idx_crossings_status ON border_crossings(status);
CREATE INDEX IF NOT EXISTS idx_crossings_created ON border_crossings(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
