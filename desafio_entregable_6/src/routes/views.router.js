import { Router } from 'express';
import ProductManager from '../dao/manager/productManager.js'
import CartManagerDB from '../dao/managersDB/cartManagerDB.js';
import ProductManagerDB from '../dao/managersDB/productManagerDB.js';

const router = Router();

const publicAccess = (req,res,next)=>{
    if (req.session.user) {
        return res.redirect('/products');
        // return res.send({
        //     status : "error",
        //     message : "tenes q darle al btn desloguear"
        // })
    }
    next();
}

const privateAccess = (req,res,next)=>{
    if (!req.session.user) {
        return res.redirect('/');
    }

    next();
}

// login
// lo q pasa aca con el middleware publiccAccess es lo sigueinte:
// si vos no lo pones el usuario puede cambiar la ruta desde el navegador y volver a login sin eliminar la sesion, osea estarias intantando loguearte con la misma sesion o otroa sesion mientras la sesion actual sigue activa
// si provas hacerlo el navegador tira error
// al usar el middleware lo q haces es una comprobacion de q si la session sigue activa (osea no se le dio al btn salir q mata la sesion) este no permite q se renderize la vista del login.handlebars osea no te deja salir de otra forma q no sea con el btn salir
// en caso de q intentes volver al login sin pasar por el btn salir, el middleware lo q hace es redirigirte la vista productos
router.get('/',publicAccess,(req,res)=>{
    res.render("login");
})

// register
router.get('/register',publicAccess,(req,res)=>{
    res.render("register");
})

// FS
const PATH = "productsList.json";
const productos = new ProductManager(PATH);
const allProducts = await productos.getProducts();

// DB
const cartsDB = new CartManagerDB();

// FS router
router.get("/productsFS", async (req, res) => {
    res.render("home", { text: "Desafio Entregable 4", products: allProducts });
});

// FS router
router.get('/realtimeproducts', (req, res) => {

    res.render('realTimeProducts', { text: "Products con socket" });
})

// DB router login
router.get('/products', async (req, res) => {
    const productsDB = new ProductManagerDB();
    const { limit, page} = req.query;

    // aca tomamos los datos cargados en el session en el sessions.routes.js
    const {full_name, email, age ,password} = req.session.user;

    // comrpobamos si el email ingresado y la contraseña corresponden al perfil del admin
    const isAdmin = email === "adminCoder@coder.com" && password === "adminCod3r123";

    const user = {
        full_name,
        age,
        email,
        rol : isAdmin ? "admin" : "usuario"
    }

    const query = {};
    const options = {
        limit : limit ?? 5,
        page : page ?? 1,
        lean : true
    }
    
    const result = await productsDB.getProducts(query,options);
    const {messagge} = result;

    res.render('products',{products : messagge, user});
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

export default router;