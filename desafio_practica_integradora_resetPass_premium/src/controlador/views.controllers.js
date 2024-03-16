import jwt from 'jsonwebtoken';
import { cartService, productService} from '../respository/index.repository.js';

class ViewsControllers {
    static login = (req, res) => {
        try {
            res.render("login");
        } catch (error) {
            req.logger.error("Error al intentar iniciar sesion");

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
            req.logger.error("Error al registrar un nuevo usuario");

            res.status(400).send({
                status: "error",
                msg: "No se logro completar el registro"
            })
        }
    }

    static recoverPass = (req, res) => {
        try {
            res.render("recoverPassword");
        } catch (error) {
            req.logger.error("Error, no se logro obtener la vista para recuperar contraseña");

            res.status(400).send({
                status: "error",
                msg: "No se logro obtener la vista recoverPassword"
            })
        }
    }

    static resetPass = (req, res) => {
        try {
            res.render("resetPassword");
        } catch (error) {
            req.logger.error("Error, al intentar obtener la vista resetPassword");

            res.status(400).send({
                status: "error",
                msg: "No se logro obtener la vista resetPassword"
            })
        }
    }

    static productsGet = async (req, res) => {
        try {
            const { limit, page } = req.query;

            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

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
            req.logger.warning("Datos del usuario incorrectos");

            res.status(400).send({
                status: "error",
                msg: "Datos del usuario incorrectos"
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
            req.logger.warning("No se logro encontrar el cart del usuario");
        }
    }

    static realtimeproducts = (req, res) => {
        try {
            
            let owner = "";

            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

            const rol = decodedToken.rol;

            if (rol === "admin") {
                owner = rol;
                console.log("soy admin");
            }
            else{
                const email = decodedToken.email;
                owner = email;
            }
            
            res.render('realTimeProducts', { owner });

        } catch (error) {
            req.logger.fatal("No se logro acceder al apartado para agregar/actualizar/eliminar productos o no cuenta con los permisos necesarios");

            res.status(400).send({
                status: "error",
                msg: "No se encontraron los productos"
            })
        }
    }
}

export { ViewsControllers };