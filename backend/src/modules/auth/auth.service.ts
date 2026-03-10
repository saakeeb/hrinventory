import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginDTO, RegisterDTO } from './auth.dto';
import pool from '@/database/pool';
import { config } from '@/config';

export async function loginService(loginData: LoginDTO) {
  const { email, password } = loginData;

  // Fetch user from database with company name
  const userQuery = await pool.query(
    `SELECT u.*, c.name as "companyName" 
     FROM users u 
     LEFT JOIN companies c ON u.company_id = c.id 
     WHERE u.email = $1 AND u.deleted_at IS NULL`, 
    [email]
  );
  const user = userQuery.rows[0];

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT
  const token = jwt.sign({ id: user.id, role: user.role, companyId: user.company_id }, config.jwtSecret, { expiresIn: '1h' });

  // Add audit log
  await pool.query(
    'INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)',
    [user.id, 'session_start', JSON.stringify({ method: 'password', timestamp: new Date() })]
  );

  return { 
    token, 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      companyName: user.companyName
    } 
  };
}

export async function registerService(registerData: RegisterDTO) {
  const { name, email, password, role, companyName } = registerData;

  // Check if user already exists
  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new Error('User with this email already exists');
  }

  // Handle Company
  let companyId: number;
  const companyQuery = await pool.query('SELECT id FROM companies WHERE name = $1', [companyName]);
  
  if (companyQuery.rows.length > 0) {
    companyId = companyQuery.rows[0].id;
  } else {
    const newCompany = await pool.query(
      'INSERT INTO companies (name) VALUES ($1) RETURNING id',
      [companyName]
    );
    companyId = newCompany.rows[0].id;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, company_id',
    [name, email, hashedPassword, role, companyId]
  );

  const user = result.rows[0];

  // Add audit log for registration
  await pool.query(
    'INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)',
    [user.id, 'user_registration', JSON.stringify({ role, companyId, timestamp: new Date() })]
  );

  // Generate JWT
  const token = jwt.sign({ id: user.id, role: user.role, companyId: user.company_id }, config.jwtSecret, { expiresIn: '1h' });

  return { token, user: { ...user, companyName } };
}