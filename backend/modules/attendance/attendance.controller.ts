import { Request, Response } from 'express';
import { checkInService, checkOutService } from './attendance.service';
import { CheckInDTO, CheckOutDTO } from './attendance.dto';

export async function checkInController(req: Request, res: Response) {
  try {
    const checkInData: CheckInDTO = req.body;
    const result = await checkInService(checkInData, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function checkOutController(req: Request, res: Response) {
  try {
    const checkOutData: CheckOutDTO = req.body;
    const result = await checkOutService(checkOutData, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}