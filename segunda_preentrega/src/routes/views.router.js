import { Router } from 'express';
import ProductManager from '../dao/manager/productManager.js'
import CartManagerDB from '../dao/managersDB/cartManagerDB.js';
import cartsModel from '../dao/models/cartsModel.js';

const router = Router();

// FS
const PATH = "productsList.json";
const productos = new ProductManager(PATH);
const allProducts = await productos.getProducts();

// DB
const cartsDB = new CartManagerDB();

// FS router
router.get("/", async (req, res) => {
    res.render("home", { text: "Desafio Entregable 4", products: allProducts });
});

// FS router
router.get('/realtimeproducts', (req, res) => {

    res.render('realTimeProducts', { text: "Products con socket" });
})

// DB router
// ACA TENES Q AGREGAR UNA VIEW NUEVA PARA
router.get('/products', async (req, res) => {
    //lo mismo q hiciste en get de products.routes lo tenes q hacer aca
    // tambien tenes q agregar boton para añadir al carrito o ver detalle del producto, esto capaz lo tengas q hacer en idex.js

    // el btn de añadir a carrito debe de poder enviar un post a mi endpoit de carrito sin necesidad de tener q abrir el detalle del producto

    // res.render('products',{products})
})

// DB router
router.get('/carts/:cartId', async (req, res) => {
    const cartId = req.params.cartId;

    const cart = await cartsDB.getCartById(cartId);
    const {products} = cart;

    const auxArray = []

    products.forEach(element => {
        console.log(element);
        const {product,quantity} = element;

        const {_id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails} = product;

        const auxProduct = {
            _id,
            quantity,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        }

        auxArray.push(auxProduct);
    });
  

    res.render("cart",{products : auxArray});
    

})

export default router;