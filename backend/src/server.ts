import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from '@/config';
import { requestLogger } from '@/middleware/request.logger';
import { errorHandler } from '@/middleware/error.middleware';

const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Mount feature module routers
import authRoutes from './modules/auth/auth.routes';
import profileRoutes from './modules/profile/profile.routes';
import companyRoutes from './modules/company/company.routes';

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/companies', companyRoutes);

app.use(errorHandler);

const server = http.createServer(app);

server.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${config.port}`);
});
