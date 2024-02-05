import ProductManager from '../dao/manager/productManager.js';
import CartManagerDB from '../dao/managersDB/cartManagerDB.js';
import ProductManagerDB from '../dao/managersDB/productManagerDB.js';
import jwt from 'jsonwebtoken';

// FS
const PATH = "productsList.json";
const productos = new ProductManager(PATH);
const allProducts = await productos.getProducts();

// DB
const cartsDB = new CartManagerDB();

class ViewsControllers{
    static login = (req, res) => {
        res.render("login");
    }

    static register = (req, res) => {
        res.render("register");
    }

    static productsGet = async (req, res) => {

        try {
            const productsDB = new ProductManagerDB();
            const { limit, page } = req.query;
    
            const tokenInfo = req.cookies["jwt-cookie"];
    
            const decodedToken = jwt.decode(tokenInfo)
    
            const { full_name, age, email, rol, cartID } = decodedToken;
    
            const user = {
                full_name,
                age,
                email,
                rol,
                cartID
            }
    
            const query = {};
            const options = {
                limit: limit ?? 5,
                page: page ?? 1,
                lean: true
            }
    
            const result = await productsDB.getProducts(query, options);
    
            const { payload } = result;
    
            res.render('products', { products: payload, user });
    
        } catch (error) {
            res.status(400).send({
                status: "error",
                msg: "Usuario no encontrado"
            })
        }
    }

    static productsPost = async (req, res) => {
        try {
            const idCart = req.body.cartId;
            const idProduct = req.body.id
    
            const result = await cartsDB.addProductToCart(idCart, idProduct);
    
        } catch (error) {
            console.log(error);
        }
    
    }

    static cartId = async (req, res) => {
        try {
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
        } catch (error) {
            console.log(error);
        }
    }

    static productsFS = async (req, res) => {
        res.render("home", { text: "Desafio Entregable 4", products: allProducts });
    }

    static realtimeproducts = (req, res) => {
        res.render('realTimeProducts', { text: "Products con socket" });
    }
}

export {ViewsControllers};