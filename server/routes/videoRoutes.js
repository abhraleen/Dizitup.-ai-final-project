import express from 'express';
import { generateVideo } from '../controllers/videoController.js';

const router = express.Router();

// POST /api/video/generate - Generate video from text prompt
router.post('/generate', generateVideo);

export default router;
