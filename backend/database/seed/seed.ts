import pool from '../src/database/pool';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    console.log('Seeding database...');

    const password = await bcrypt.hash('password123', 10);

    // Insert users
    const users = [
      { name: 'Owner User', email: 'owner@example.com', role: 'owner', password },
      { name: 'Manager User', email: 'manager@example.com', role: 'manager', password },
      { name: 'Worker User', email: 'worker@example.com', role: 'worker', password },
    ];

    for (const user of users) {
      await pool.query(
        `INSERT INTO users (name, email, role, password, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [user.name, user.email, user.role, user.password]
      );
    }

    console.log('Users seeded.');

    // Insert holidays
    const holidays = [
      { name: 'New Year', date: '2026-01-01' },
      { name: 'Labor Day', date: '2026-05-01' },
    ];

    for (const holiday of holidays) {
      await pool.query(
        `INSERT INTO holidays (name, date, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())`,
        [holiday.name, holiday.date]
      );
    }

    console.log('Holidays seeded.');

    console.log('Database seeding complete.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

seed();