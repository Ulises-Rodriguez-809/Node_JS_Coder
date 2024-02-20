import { Router } from 'express';
import {ViewsControllers} from '../controlador/views.controllers.js'
import { checkRole } from '../middlewares/auth.js';

// inicializamos Router
const router = Router();

// login
router.get('/', ViewsControllers.login);

// register
router.get('/register', ViewsControllers.register);

// ticket
router.get("/ticket",ViewsControllers.ticket);

// DB router ruta cuadno te logueaas
router.get('/products', ViewsControllers.productsGet);

// router add products form
router.post('/products', ViewsControllers.productsPost);

// DB router
router.get('/carts/:cartId', ViewsControllers.cartId);

// NO TE OLVIDES DE HACER LA VISTA
// DB router --> esto usalo para q el admin pueda agregar productos
router.get('/realtimeproducts', checkRole(["admin"]), ViewsControllers.realtimeproducts);

export default router;