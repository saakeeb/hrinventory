-- Migration: Create attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    check_in TIMESTAMP NOT NULL,
    check_out TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_check_in ON attendance(check_in);
CREATE INDEX idx_attendance_deleted_at ON attendance(deleted_at);