import jwt from 'jsonwebtoken';
import { cartService, productService, ticketService } from '../respository/index.repository.js';

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

            const result = await productService.getAll(query, options);

            const { payload } = result;

            res.render('products', { products: payload, user });

        } catch (error) {
            res.status(400).send({
                status: "error",
                msg: "Usuario no encontrado"
            })
        }
    }

    static cartId = async (req, res) => {
        try {
            const cartId = req.params.cartId;

            const cart = await cartService.getById(cartId);
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