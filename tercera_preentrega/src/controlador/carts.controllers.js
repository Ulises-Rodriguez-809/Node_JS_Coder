import jwt from 'jsonwebtoken';
import { cartService, ticketService } from '../respository/index.repository.js';
import { emailSender } from '../utils.js';

class CartsControllers {
    static getAllCarts = async (req, res) => {
        try {
            const result = await cartService.getAll();

            if (typeof result !== "object") {
                res.status(400).send({
                    status: "error",
                    message: result
                });

            } else {
                res.send({
                    status: "success",
                    message: result
                });
            }

        } catch (error) {
            console.log(error);
        }
    }

    static getCartById = async (req, res) => {
        try {
            const id = req.params.cartId;

            const result = await cartService.getById(id);

            if (typeof result === "string") {
                res.status(400).send({
                    status: "error",
                    message: result
                });

            } else {
                res.send({
                    status: "success",
                    message: result
                });
            }

        } catch (error) {
            console.log(error);
        }
    }

    static addCart = async (req, res) => {

        const cart = await cartService.create();

        res.send({
            status: "succes",
            cart
        });
    }

    static addProductToCart = async (req, res) => {
        try {
            const cartId = req.params.cartId;
            const productId = req.params.productId;
            const { quantity } = req.body;

            const result = await cartService.add(cartId, productId, parseInt(quantity));

            if (typeof result === "string") {
                res.status(400).send({
                    status: "error",
                    message: result
                });

            } else {
                res.send({
                    status: "success",
                    message: result
                });
            }

        } catch (error) {
            console.log(error);
        }

    }

    static purchase = async (req, res) => {
        try {
            const cartId = req.params.cartId;

            const result = await ticketService.create(cartId);

            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

            const {full_name,email} = decodedToken;

            const ticket = await ticketService.get(email);

            const {code,purchase_datetime,amount,purchaser} = ticket;

            console.log(ticket);

            const template = `<div>
            <h1>Felicidades ${full_name}!!</h1>
            <p>Tu compra se realizo con exito</p>
            <div>
                <ul>
                    <li>tu codigo de compra es: ${code}</li>
                    <li>dia de confirmacion de compra: ${purchase_datetime}</li>
                    <li>total: ${amount}</li>
                    <li>comprador: ${purchaser}</li>
                </ul>
            </div>
            <div>
                <p>Ante cualquier duda comunicarce a nuestro atencio al cliente</p>
                <p>email : atencioCliente@gmail.com</p>
                <p>phone: +5555555555</p>
            </div>
            <a href="http://localhost:8080/">Ir a la pagina</a>
            </div>`;

            const respond = await emailSender(full_name,email,template);

            console.log(respond);

            if (!result) {
                return res.status(400).send({
                    status: "error",
                    payload: "La compra no se logro hacer con exito"
                })
            }

            res.send({
                status: "success",
                payload: result
            })

        } catch (error) {
            console.log(error.message);
        }
    }

    static updateCart = async (req, res) => {
        const cartId = req.params.cartId;
        const { products } = req.body;

        const result = await cartService.updateList(cartId, products);

        if (typeof result === "string") {
            res.status(400).send({
                status: "error",
                message: result
            });

        } else {
            res.send({
                status: "success",
                message: result
            });
        }
    }

    static updateProductsQuantity = async (req, res) => {
        try {
            const cartId = req.params.cartId;
            const productId = req.params.productId;
            const { quantity } = req.body;

            const result = await cartService.updateQuantity(cartId, productId, quantity);

            if (typeof result === "string") {
                res.status(400).send({
                    status: "error",
                    message: result
                });

            } else {
                res.send({
                    status: "success",
                    message: result
                });
            }

        } catch (error) {
            console.log(error);
        }
    }

    static clearCart = async (req, res) => {

        try {
            const id = req.params.cartId;

            const result = await cartService.deleteAll(id);

            if (typeof result === "string") {
                res.status(400).send({
                    status: "error",
                    message: result
                });

            } else {
                res.send({
                    status: "success",
                    message: `Los productos del cart: ${id} se eliminaron con exito`
                });
            }

        } catch (error) {
            console.log(error);
        }
    }

    static deleteProductFromCart = async (req, res) => {

        try {
            const cartId = req.params.cartId;
            const productId = req.params.productId;

            const result = await cartService.deleteOne(cartId, productId);

            if (typeof result === "string") {
                res.status(400).send({
                    status: "error",
                    message: result
                });

            } else {
                res.send({
                    status: "success",
                    message: `Se logro eliminar con exito el cart con el id: ${cartId}`
                });
            }

        } catch (error) {
            console.log(error);
        }
    }
}

export { CartsControllers }