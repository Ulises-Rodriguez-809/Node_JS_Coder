import { Router } from 'express';
import ProductManager from '../manager/productManager.js';

const router = Router();
const PATH = "productsList.json";
const productos = new ProductManager(PATH);

const allProducts = await productos.getProducts();


router.get("/", async (req, res) => {
    // Crear una vista “home.handlebars” la cual contenga una lista de todos los productos agregados hasta el momento
    //10-vamos a renderizar la vista home
    //home por nuestra home.handlebars
    //{} es lo q se renderiza de forma dinamica en nuestro home.handlebars
    res.render("home", { text: "Desafio Entregable 4", products: allProducts });
});

router.get('/realtimeproducts', (req, res) => {

    res.render('realTimeProducts', { text: "Products con socket" });
})

export default router;