import { Router } from 'express';
import { ProductsControllers } from '../controlador/products.controllers.js'
import { checkRole } from '../middlewares/auth.js';

const router = Router();

router.get("/", ProductsControllers.getProductsPaginate);

router.get("/:productId", ProductsControllers.getProductById);

// ruta original
router.post("/", checkRole(["premium","admin"]), ProductsControllers.addProduct);
// ruta para probar el test
router.post("/testingPost", ProductsControllers.addProduct);

// enpoint original
router.put("/:productId", checkRole(["admin"]), ProductsControllers.updateProduct);
// enpoint para probar el testing
router.put("/testingPut/:productId", ProductsControllers.updateProduct);

// enpoint original
router.delete("/:productId", checkRole(["premium","admin"]), ProductsControllers.deleteProduct);
// enpoint para probar el testing
router.delete("/testingDelete/:productId", checkRole(["premium","admin"]), ProductsControllers.deleteProduct);

export default router;