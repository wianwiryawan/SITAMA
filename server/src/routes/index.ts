import { Router } from 'express';
import * as authController from '../controllers/authController';
// import * as taskController from '../controllers/taskController';
// import { authenticateToken } from '../middleware/authMiddleware'; // Impor middleware kamu

const router = Router();

// Rute ga dikunci
router.post('/login', authController.login);

//rute dikunci oleh token, jika token salah, gabisa masuk
// router.get('/tasks', authenticateToken, taskController.getAllTasks);
// router.post('/tasks', authenticateToken, taskController.createTask);

export default router;