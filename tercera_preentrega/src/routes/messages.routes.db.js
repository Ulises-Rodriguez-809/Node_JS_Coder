import {Router} from 'express'
import { MessageController } from '../controlador/messages.controllers.js';

const router = Router();

router.get('/chat', MessageController.chat)


export default router;