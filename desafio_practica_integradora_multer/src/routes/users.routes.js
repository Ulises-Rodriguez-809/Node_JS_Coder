import {Router} from 'express';
import {UsersControllers} from '../controlador/users.controller.js';

const router = Router();

// change rol user to premium
router.post("/premiumUser", UsersControllers.premiumUser);

// falta agregar el otro endpoint, mostrar ticket, cambiar forma de volverse user premium

export default router;