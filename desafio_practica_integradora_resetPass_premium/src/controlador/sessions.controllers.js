import jwt from 'jsonwebtoken';
import { options } from '../config/config.js';
import { userService } from '../respository/index.repository.js';
import { emailSender } from '../utils.js';

class SessionControler {
    static register = async (req, res) => {
        try {
            const { first_name, last_name, email } = req.user;

            const full_name = first_name.concat(" ", last_name);
            const subject = "Restablecer contraseña";


            const template = `<div>
            <h1>Bienvenido ${full_name}!!</h1>
            <img src="https://www.ceupe.com/images/easyblog_articles/3625/b2ap3_large_que-es-un-tienda-online.png" style="width:250px; height : 250px"/>
            <p>Ya puedes empezar a usar nuestros servicios</p>
            <a href="http://localhost:8080/">Ir a la pagina</a>
            </div>`;

            const respond = await emailSender(full_name, email, template,subject);

            if (!respond) {
                req.logger.warning("La compra se realizo pero no se logro enviar el email de confirmacion de esta");
            }

            res.send({
                status: "success",
                message: "Usuario registrado con exito",
                payload: req.user._id
            })

        } catch (error) {
            res.status(400).send({
                status: "error",
                payload: "Usuario ya registrado"
            })
        }
    }

    static failregister = async (req, res) => {
        req.logger.error("No se logro completar el registro del nuevo usuario con exito");

        res.status(400).send({
            status: "error",
            message: "No se logro el registro con exito"
        })
    }

    static login = async (req, res) => {
        try {
            // DATA: el req.user te lo agrega el passport por defecto cuando hace la autenticacion 
            if (!req.user) {
                req.logger.error("Error, no se logro obtener los datos del usuario");

                return res.status(400).send({
                    status: "error",
                    message: "Usuario no encontrado"
                })
            }

            let user = {};

            const { first_name, last_name, age, email, password, cart } = req.user;

            if (email === options.ADMIN_EMAIL && password === options.ADMIN_PASSWORD) {
                user = {
                    full_name: `${first_name} ${last_name}`,
                    age,
                    email,
                    rol: "admin"
                }

                req.logger.info("usuario con rol admin");

            }
            else {

                if (!first_name || !last_name || !age || !email || !password || !cart) {
                    req.logger.error("Error con los datos del usuario");

                    return res.status(400).send({
                        status: "error",
                        payload: "datos incompletos"
                    })
                }

                user = {
                    full_name: `${first_name} ${last_name}`,
                    age,
                    email,
                    rol: "user",
                    cartID: cart._id
                }

                req.logger.info("usuario con rol user");

            }

            const token = jwt.sign(user, options.JWT_SECRET_WORD, { expiresIn: "2h" });

            // enviamos el token por la cookie
            // HttpOnly Cookies evitan que los scripts del lado del cliente accedan a estas cookies, reduciendo significativamente el riesgo de ataques XSS
            res.cookie(options.COOKIE_WORD, token, { httpOnly: true, maxAge: 3600000 }).json({
                status: "success",
                payload: token
            })

        } catch (error) {
            req.logger.error("Error con los datos del usuario");

            res.status(400).send({
                status: "error",
                payload: "Usuario no encontrado"
            })
        }
    }

    static faillogin = async (req, res) => {
        req.logger.error("No se logro completar el login del usuario con exito");

        res.status(400).send({
            status: "error",
            payload: "fallo en el login"
        })

    }

    static githubcallback = async (req, res) => {
        try {
            if (!req.user) {
                req.logger.error("Error, usuario no encontrado");

                return res.status(400).send({
                    status: "error",
                    message: "Usuario no encontrado"
                })
            }

            const { first_name, last_name, age, email, rol, cart } = req.user;


            if (!first_name || !last_name || !age || !email || !cart) {
                req.logger.error("Error, no se logro obtener los datos del usuario desde github");

                return res.status(400).send({
                    status: "error",
                    payload: "datos incompletos"
                })
            }

            const user = {
                full_name: `${first_name} ${last_name}`,
                age,
                email,
                rol,
                cartID: cart._id
            }

            const token = jwt.sign(user, options.JWT_SECRET_WORD, { expiresIn: "2h" });

            res.cookie(options.COOKIE_WORD, token, { httpOnly: true, maxAge: 3600000 })

            res.redirect("/products");

        } catch (error) {
            req.logger.error("No se encontro la cuenta de Github del usuario");

            res.status(400).send({
                status: "error",
                payload: "No se logro iniciar sesion con github"
            })
        }
    }

    static revocerPassword = async (req,res)=>{
        try {
            const {email} = req.body;

            console.log(email);

            const user = await userService.get({email});
            const full_name = user.full_name;
            const subject = "Restablecer contraseña";

            const template = `<div>
            <h1>Hola ${full_name}!!</h1>
            <p>Lamentamos la perdida de tu contraseña, pero no te preocupes</p>
            <p>Ingresando al siguiente link podras obtener una contraseña nueva</p>
            <a href="http://localhost:8080/resetPassword">Restrablecer contraseña</a>
            </div>`;

            const respond = await emailSender(full_name,email,template,subject);

            console.log(respond);

            if (!respond) {
                return res.status(400).send({
                    status : "error",
                    payload : "No se logro enviar el mail para restrablecer la contraseña"
                })                
            }

            res.send({
                status : "success",
                payload : "mail enviado con exito"
            })

        } catch (error) {
            res.status(400).send({
                status: "error",
                payload: "Usuario ya registrado"
            })
        }
    }

    static resetPassword = async(req,res)=>{
        
    }

    static logout = async (req, res) => {
        if (req.cookies[options.COOKIE_WORD]) {
            res.clearCookie(options.COOKIE_WORD);

            req.logger.info("Cookie limpiada con exito");

            res.redirect('/');

        } else {
            req.logger.error("No se logro cerrar la sesion del usuario");

            res.status(401).send({
                status: "error",
                payload: "No se logro desloguear con exito"
            })
        }
    }

    static current = async (req, res) => {
        try {
            if (!req.user) {
                req.logger.error("Error, usuario no encontrado");

                return res.status(401).send({
                    status: "error",
                    payload: "No se encontro el usuario"
                })
            }

            const userInfoDto = await userService.get(req.user);

            res.send({
                status: "success",
                payload: userInfoDto
            })

        } catch (error) {
            req.logger.error("Error, no se logro obtener los datos del usuario");

            res.status(400).send({
                status: "error",
                payload: "No se logro obtener los datos"
            })
        }
    }

    static failcurret = async (req, res) => {
        req.logger.warning("No se logro obtener los datos del usuario actual");

        res.status(400).send({
            error: "fallo en obtener los datos del usuario"
        })
    }
}

export { SessionControler };