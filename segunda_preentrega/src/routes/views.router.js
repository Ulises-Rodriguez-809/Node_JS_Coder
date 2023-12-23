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

// ACA TENES Q AGREGAR UNA VIEW NUEVA PARA
router.get('/products', async (req, res) => {
    //lo mismo q hiciste en get de products.routes lo tenes q hacer aca
    // tambien tenes q agregar boton para añadir al carrito o ver detalle del producto, esto capaz lo tengas q hacer en idex.js

    // el btn de añadir a carrito debe de poder enviar un post a mi endpoit de carrito sin necesidad de tener q abrir el detalle del producto

    // res.render('products',{products})
})

router.get('/carts/:cartId', async (req, res) => {
    // aca create un .handlebars para el carrito en especifico
    // tiene q visualizarse solo los productos del carrito
})

export default router;