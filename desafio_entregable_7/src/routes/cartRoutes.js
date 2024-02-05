import { Router } from 'express';
import {CartsControllersFS} from '../controlador/carts.controllers.FS.js'

const router = Router();

//obtener todos los carts
router.get('/', CartsControllersFS.getCarts)

//obtener 1 cart por el id
router.get('/:cartId', CartsControllersFS.getCartById)

//crear un nuevo cart y añadirlo al json de carts
router.post('/', CartsControllersFS.createCart)

//añadir un producto (id y quantity) a un cart (por el id)
router.post('/:cartId/product/:productId', CartsControllersFS.addProductToCart)

//eliminar un cart
router.delete('/:cartId', CartsControllersFS.deleteCart)

export default router;