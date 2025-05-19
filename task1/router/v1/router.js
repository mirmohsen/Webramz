import express from 'express';
import auth from './auth.js';
import upload from './upload.js';

const router = express.Router();

router.use('/auth', auth);
router.use('/file-manager', upload);

export default router;
