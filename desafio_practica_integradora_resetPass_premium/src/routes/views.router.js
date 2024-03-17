import { Router } from 'express';
import {ViewsControllers} from '../controlador/views.controllers.js'
import { checkRole, verifyEmailTokenMW } from '../middlewares/auth.js';

// inicializamos Router
const router = Router();

// login
router.get('/', ViewsControllers.login);

// register
router.get('/register', ViewsControllers.register);

// recuperar contraseña
router.get('/recoverPassword', ViewsControllers.recoverPass);

// cambiar contraseña
// verifyEmailTokenMW se encarga de ver si el token esta expirado
// verifyEmailTokenMW() --> capaz tenes q pasarlo asi
// si lo trabajas asi anda el middleware pero si le sacas los () deja de andar xq dice q necesita un callbalck
// a pesar de q el callback esta en ViewsControllers.resetPass por algun motivo no lo toma
// router.get('/resetPassword', verifyEmailTokenMW(), ViewsControllers.resetPass, async(req,res)=>{
    
// });
router.get('/resetPassword', verifyEmailTokenMW(),ViewsControllers.resetPass);
// router.get('/resetPassword', ViewsControllers.resetPass);

// DB router ruta cuadno te logueaas
router.get('/products', ViewsControllers.productsGet);

// DB router
router.get('/carts/:cartId', ViewsControllers.cartId);

// DB router --> esto usalo para q el admin pueda agregar productos
router.get('/realtimeproducts', checkRole(["premium","admin"]), ViewsControllers.realtimeproducts);

export default router;