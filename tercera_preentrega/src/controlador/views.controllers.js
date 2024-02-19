import { CartManagerDB } from '../dao/managersDB/cartManagerDB.js';
import { ProductManagerDB } from '../dao/managersDB/productManagerDB.js';
import jwt from 'jsonwebtoken';
import { TicketManager } from '../dao/managersDB/ticketManagerDB.js';

// DB
const cartsDB = new CartManagerDB();
const productsDB = new ProductManagerDB();
const ticketDB = new TicketManager();

class ViewsControllers {
    static login = (req, res) => {
        try {
            res.render("login");
        } catch (error) {
            res.status(400).send({
                status: "error",
                msg: "No se concretar el logueo con exito"
            })
        }
    }

    static register = (req, res) => {
        try {
            res.render("register");
        } catch (error) {
            res.status(400).send({
                status: "error",
                msg: "No se logro completar el registro"
            })
        }
    }

    static ticket = async (req, res) => {
        try {

            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

            const { email } = decodedToken;

            const ticketInfo = await ticketDB.getTicket(email);

            console.log(ticketInfo);

            res.render("ticket", { ticketInfo });

        } catch (error) {
            res.status(400).send({
                status: "error",
                msg: "No se encontro el ticket"
            })
        }
    }

    static productsGet = async (req, res) => {

        try {
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

    static realtimeproducts = (req, res) => {
        try {
            res.render('realTimeProducts', { text: "Products con socket" });
        } catch (error) {
            res.status(400).send({
                status: "error",
                msg: "No se encontraron los productos"
            })
        }
    }
}

export { ViewsControllers };