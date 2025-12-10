import { Router } from 'express';

import { ApiRoutes } from '@/constants/apiRoutes.constant';
import { healthCheck } from '@/controllers/health.controller';
import { downloadExcelWithNodeXlsx, downloadFile, extractText } from '@/controllers/misc.controller';

import { authRouter } from './auth';

export const apiRouter = Router();

apiRouter.use(ApiRoutes.AUTH, authRouter);

apiRouter.get(ApiRoutes.HEALTH, healthCheck);

apiRouter.get(ApiRoutes.DOWNLOAD_FILE, downloadFile);

// apiRouter.get(ApiRoutes.DOWNLOAD_EXCEL, downloadExcelFile)

apiRouter.get(ApiRoutes.DOWNLOAD_EXCEL, downloadExcelWithNodeXlsx);

apiRouter.get(ApiRoutes.OCR, extractText);
