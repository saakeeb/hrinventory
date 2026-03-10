import { Request, Response } from 'express';
import { createUserService } from './users.service';
import { CreateUserDTO } from './users.dto';

export async function createUserController(req: Request, res: Response) {
  try {
    const createUserData: CreateUserDTO = req.body;
    const result = await createUserService(createUserData);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}