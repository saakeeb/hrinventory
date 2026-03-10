import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { requestLogger } from './middleware/request.logger';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from '../modules/auth/auth.routes';
import profileRoutes from '../modules/profile/profile.routes';
import { config } from './config';

const app = express();

// --- Security Middleware ---
app.use(helmet());
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
}));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use(express.json());
app.use(requestLogger);

// --- Routes ---
app.get('/health', (req, res) => res.send('OK'));
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// --- Error Handler ---
app.use(errorHandler);

export default app;