import express from 'express';
import { searchFiles } from '../../controller/search.js';
import { authenticate } from '../../utils/jwt.js';

const router = express.Router();

router.get('/search', authenticate, searchFiles);

export default router;
