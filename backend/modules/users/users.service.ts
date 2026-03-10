import bcrypt from 'bcrypt';
import pool from '@/database/pool';
import { CreateUserDTO } from './users.dto';

export async function createUserService(createUserData: CreateUserDTO) {
  const { name, email, password, role, managerId } = createUserData;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into database
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, manager_id, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id, name, email, role`,
    [name, email, hashedPassword, role, managerId]
  );

  return result.rows[0];
}