import { Router } from 'express';
import ProductManager from '../dao/manager/productManager.js'
import CartManagerDB from '../dao/managersDB/cartManagerDB.js';
import ProductManagerDB from '../dao/managersDB/productManagerDB.js';
import jwt from 'jsonwebtoken'

// FS
const PATH = "productsList.json";
const productos = new ProductManager(PATH);
const allProducts = await productos.getProducts();

// DB
const cartsDB = new CartManagerDB();

// inicializamos Router
const router = Router();

// login
router.get('/',(req,res)=>{
    res.render("login");
})

// register
router.get('/register',(req,res)=>{
    res.render("register");
})

// DB router ruta cuadno te logueaas
router.get('/products', async (req, res) => {
    const productsDB = new ProductManagerDB();
    const { limit, page} = req.query;
    
    const decodedToken = jwt.decode(req.cookies["jwt-cookie"])

    console.log(decodedToken);

    const {full_name, age, email ,rol, cartID} = decodedToken;

    const isAdmin = email === "adminCoder@coder.com";

    const user = {
        full_name,
        age,
        email,
        rol : isAdmin ? "admin" : rol,
        cartID
    }

    const query = {};
    const options = {
        limit : limit ?? 5,
        page : page ?? 1,
        lean : true
    }
    
    const result = await productsDB.getProducts(query,options);
    const {payload} = result;

    res.render('products',{products : payload, user});
})

// router add products form
router.post('/products', async (req, res) => {
    try {
        const idCart = req.body.cartId;
        const idProduct = req.body.id

        const result = await cartsDB.addProductToCart(idCart,idProduct);

    } catch (error) {
        console.log(error);
    }

})

// DB router
router.get('/carts/:cartId', async (req, res) => {
    const cartId = req.params.cartId;

    const cart = await cartsDB.getCartById(cartId);
    const { products } = cart;

    const auxArray = []

    products.forEach(element => {
        const { product, quantity } = element;

        const { _id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails } = product;

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

    res.render("cart", { products: auxArray });

})

// FS router
router.get("/productsFS", async (req, res) => {
    res.render("home", { text: "Desafio Entregable 4", products: allProducts });
});

// FS router
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { text: "Products con socket" });
})

export default router;