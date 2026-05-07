import { Router } from 'express';
import { login } from './controllers/authController';
import { taskController } from './controllers/taskController';
import { eventController } from './controllers/eventController';
import { getAllUsers } from './controllers/userController';
import { LogController } from './controllers/logController';
// import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/users', getAllUsers);

router.get('/tasks', taskController.getAllTasks);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

router.get('/events', eventController.getAllEvents);
router.post('/events', eventController.createEvent); 
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);
router.post('/generate-st', eventController.generateST);
router.post('/generate-st-docx', eventController.generateSTDocx);
router.post('/generate-spt', eventController.generateSPT);

router.get('/logs', LogController.getAllLogs);
router.post('/logs', LogController.createLog); 

export default router;