import { Router } from 'express';
import pool from '@/database/pool';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM companies ORDER BY name ASC');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
