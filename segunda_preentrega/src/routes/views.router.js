import { Router } from 'express';
import ProductManager from '../dao/manager/productManager.js'
import CartManagerDB from '../dao/managersDB/cartManagerDB.js';
import ProductManagerDB from '../dao/managersDB/productManagerDB.js';

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

// ACA CAPAZ TENGAS Q HACER Q SE INGRESE EL ID DEL CART
router.get('/products', async (req, res) => {
    const productsDB = new ProductManagerDB();
    const { limit, page} = req.query;


    const query = {};
    const options = {
        limit : limit ?? 5,
        page : page ?? 1,
        lean : true
    }
    
    const result = await productsDB.getProducts(query,options);
    const {messagge} = result;


    res.render('products',{products : messagge});
})

router.post('/products', async (req, res) => {
    try {
        const idCart = req.body.cartId;
        // const idProduct = req.body.id;
        const idProduct = req.body.id

        console.log(idCart);
        console.log(idProduct);
        // console.log(idProduct);

        const result = await cartsDB.addProductToCart(idCart,idProduct);

        // res.send({});
        // return;
        // 6585e78661847a6e6f60cd01 6585e83b61847a6e6f60cd0a

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
        console.log(element);
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

export default router;