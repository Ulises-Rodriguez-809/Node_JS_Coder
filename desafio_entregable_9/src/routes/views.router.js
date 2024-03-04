import { Router } from 'express';
import {ViewsControllers} from '../controlador/views.controllers.js'
import { checkRole } from '../middlewares/auth.js';

// inicializamos Router
const router = Router();

// login
router.get('/', ViewsControllers.login);

// register
router.get('/register', ViewsControllers.register);

// DB router ruta cuadno te logueaas
router.get('/products', ViewsControllers.productsGet);

// DB router
router.get('/carts/:cartId', ViewsControllers.cartId);

// DB router --> esto usalo para q el admin pueda agregar productos
router.get('/realtimeproducts', checkRole(["admin"]), ViewsControllers.realtimeproducts);

export default router;