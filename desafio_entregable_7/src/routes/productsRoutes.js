import { Router } from 'express';
import {ProductsControllerFS} from '../controlador/products.controllers.FS.js'

const router = Router();

//ruta q muestra todos los productos o una cantidad especifica si se pasa una variable por la url (query params)
router.get("/", ProductsControllerFS.getProducts);

//mostrar un producto especifico dependiendo su id
router.get("/:idProducto", ProductsControllerFS.getProductsById);

//añadir un nuevo producto
router.post("/", ProductsControllerFS.addProduct);

//modificar las props de un producto
router.put("/:idProducto", ProductsControllerFS.updateProduct);

//eliminar un producto
router.delete("/:idProducto", ProductsControllerFS.deleteProduct);

export default router;