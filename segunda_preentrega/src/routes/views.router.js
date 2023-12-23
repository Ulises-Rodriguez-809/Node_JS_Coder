import { Router } from 'express';
import ProductManager from '../dao/manager/productManager.js'

const router = Router();
const PATH = "productsList.json";
const productos = new ProductManager(PATH);

const allProducts = await productos.getProducts();


router.get("/", async (req, res) => {
    res.render("home", { text: "Desafio Entregable 4", products: allProducts });
});

router.get('/realtimeproducts', (req, res) => {

    res.render('realTimeProducts', { text: "Products con socket" });
})

export default router;