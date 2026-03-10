import pool from '@/database/pool';

export async function getProfileService(userId: number) {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.office_location, u.working_hours, u.avatar, u.created_at, c.name as "companyName"
     FROM users u
     LEFT JOIN companies c ON u.company_id = c.id
     WHERE u.id = $1 AND u.deleted_at IS NULL`,
    [userId]
  );
  
  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
}

export async function updateProfileService(userId: number, updateData: any) {
  const { name, office_location, working_hours, avatar } = updateData;
  
  const result = await pool.query(
    `UPDATE users 
     SET name = COALESCE($1, name), 
         office_location = COALESCE($2, office_location),
         working_hours = COALESCE($3, working_hours),
         avatar = COALESCE($4, avatar),
         updated_at = NOW()
     WHERE id = $5 AND deleted_at IS NULL
     RETURNING id, name, email, role, office_location, working_hours, avatar, company_id`,
    [name, office_location, working_hours, avatar, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  const updatedUser = result.rows[0];

  // Fetch company name separately or join if needed. 
  // Since we already have the user, we can just grab the name.
  if (updatedUser.company_id) {
    const companyRes = await pool.query('SELECT name FROM companies WHERE id = $1', [updatedUser.company_id]);
    updatedUser.companyName = companyRes.rows[0]?.name;
  }

  // Add audit log for profile update
  await pool.query(
    'INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)',
    [userId, 'profile_update', JSON.stringify({ 
      fields: Object.keys(updateData).filter(k => updateData[k] !== undefined),
      timestamp: new Date() 
    })]
  );

  return updatedUser;
}

export async function getAuditLogsService(userId: number) {
  const result = await pool.query(
    'SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
    [userId]
  );
  return result.rows;
}
