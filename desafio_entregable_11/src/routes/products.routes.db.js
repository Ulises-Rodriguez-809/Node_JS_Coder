import { Router } from 'express';
import { ProductsControllers } from '../controlador/products.controllers.js'
import { checkRole } from '../middlewares/auth.js';

const router = Router();

router.get("/", ProductsControllers.getProductsPaginate);

router.get("/:productId", ProductsControllers.getProductById);

router.post("/", checkRole(["premium","admin"]), ProductsControllers.addProduct);

router.put("/:productId", checkRole(["admin"]), ProductsControllers.updateProduct);

router.delete("/:productId", checkRole(["premium","admin"]), ProductsControllers.deleteProduct);

export default router;