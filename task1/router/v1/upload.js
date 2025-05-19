import express from 'express';
import { upload } from '../../middleware/upload.js';
import { uploadFile } from '../../controller/upload.js';
import { authenticate } from '../../utils/jwt.js';

const router = express.Router();

router.post('/upload', authenticate, upload.single('file'), uploadFile);

export default router;
