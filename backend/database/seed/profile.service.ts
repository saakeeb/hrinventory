import pool from '@/database/pool';
import { UpdateProfileDTO } from './profile.dto';

export async function getProfileService(userId: number) {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, avatar, office_location, working_hours, leave_balance, manager_id FROM users WHERE id = $1 AND deleted_at IS NULL',
    [userId]
  );
  return rows[0];
}

export async function updateProfileService(userId: number, userRole: string, data: UpdateProfileDTO) {
  const allowedFieldsForWorker = ['name', 'avatar'];
  const fieldsToUpdate = Object.keys(data);

  if (userRole === 'worker') {
    for (const field of fieldsToUpdate) {
      if (!allowedFieldsForWorker.includes(field)) {
        throw new Error(`As a worker, you are not allowed to update ${field}.`);
      }
    }
  }

  const { rows: oldProfileDataArr } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  const oldProfileData = oldProfileDataArr[0];

  const setClauses = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(data)) {
    setClauses.push(`${key} = $${i++}`);
    values.push(value);
  }

  if (setClauses.length === 0) {
    return getProfileService(userId);
  }

  setClauses.push(`updated_at = NOW()`);
  values.push(userId);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updateQuery = `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${i}`;
    await client.query(updateQuery, values);

    const changes = {};
    for (const key of fieldsToUpdate) {
      if (oldProfileData[key] !== data[key]) {
        changes[key] = { old: oldProfileData[key], new: data[key] };
      }
    }

    if (Object.keys(changes).length > 0) {
        await client.query(
            'INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)',
            [userId, 'PROFILE_UPDATE', JSON.stringify(changes)]
        );
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }

  return getProfileService(userId);
}

export async function getAuditLogsService(userId: number) {
    const { rows } = await pool.query(
        'SELECT action, details, created_at FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
    );
    return rows;
}