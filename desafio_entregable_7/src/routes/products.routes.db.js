import { Router } from 'express';
import {ProductsControllers} from '../controlador/products.controllers.js'

const router = Router();

router.get("/", ProductsControllers.getProductsPaginate)

router.get("/:productId", ProductsControllers.getProductById)

router.post("/", ProductsControllers.addProduct)

router.put("/:productId", ProductsControllers.updateProduct)

router.delete("/:productId", ProductsControllers.deleteProduct)

export default router;