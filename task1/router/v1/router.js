import express from 'express';
import auth from './auth.js';
import upload from './upload.js';
import search from './search.js';

const router = express.Router();

router.use('/auth', auth);
router.use('/file-manager', upload);
router.use('/file', search);

export default router;
