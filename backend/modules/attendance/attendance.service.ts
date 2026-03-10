import pool from '@/database/pool';
import { CheckInDTO, CheckOutDTO } from './attendance.dto';

export async function checkInService(checkInData: CheckInDTO, userId: number) {
  const { checkInTime } = checkInData;

  const result = await pool.query(
    `INSERT INTO attendance (user_id, check_in, created_at, updated_at)
     VALUES ($1, $2, NOW(), NOW()) RETURNING id, user_id, check_in`,
    [userId, checkInTime]
  );

  return result.rows[0];
}

export async function checkOutService(checkOutData: CheckOutDTO, userId: number) {
  const { checkOutTime } = checkOutData;

  const result = await pool.query(
    `UPDATE attendance
     SET check_out = $1, updated_at = NOW()
     WHERE user_id = $2 AND check_out IS NULL
     RETURNING id, user_id, check_in, check_out`,
    [checkOutTime, userId]
  );

  if (result.rowCount === 0) {
    throw new Error('No active check-in found for the user.');
  }

  return result.rows[0];
}