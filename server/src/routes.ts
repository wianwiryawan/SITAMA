import { Router } from 'express';
import { login } from './controllers/authController';
import { getAllTasks } from './controllers/taskController';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from './controllers/eventController';
import { getAllUsers } from './controllers/userController';
// import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/users', getAllUsers);

router.get('/tasks', getAllTasks);
// router.post('/tasks', createTask);
// router.put('/tasks/:id', updateTaskStatus);

router.get('/events', getAllEvents);
router.post('/events', createEvent); 
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

export default router;