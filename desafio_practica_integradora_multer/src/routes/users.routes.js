import {Router} from 'express';
import {UsersControllers} from '../controlador/users.controller.js';

const router = Router();

// change rol user to premium
router.post("/premiumUser", UsersControllers.premiumUser);


export default router;