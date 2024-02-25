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

// DB admin agregar/eliminar/update products
router.get('/realtimeproducts', checkRole(["admin"]), ViewsControllers.realtimeproducts);

export default router;