import jwt from 'jsonwebtoken';
import { options } from '../config/config.js';
import {userService} from '../respository/index.repository.js';
import { emailSender } from '../utils.js';

class SessionControler {
    static register = async (req, res) => {
        try {
            const {first_name, last_name,email} = req.user;

            const full_name = first_name.concat(" ",last_name);

            console.log(req.user.email);

            const respond = await emailSender(full_name,email);

            console.log(respond);

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
        console.log("fallo el registro");

        res.status(400).send({
            status: "error",
            message: "No se logro el registro con exito"
        })
    }

    static login = async (req, res) => {
        try {
            // DATA: el req.user te lo agrega el passport por defecto cuando hace la autenticacion 
            if (!req.user) {
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
            }
            else {

                if (!first_name || !last_name || !age || !email || !password || !cart) {
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
            }

            const token = jwt.sign(user, options.JWT_SECRET_WORD, { expiresIn: "2h" });

            // enviamos el token por la cookie
            // HttpOnly Cookies evitan que los scripts del lado del cliente accedan a estas cookies, reduciendo significativamente el riesgo de ataques XSS
            res.cookie(options.COOKIE_WORD, token, { httpOnly: true, maxAge: 3600000 }).json({
                status: "success",
                payload: token
            })

        } catch (error) {
            res.status(400).send({
                status: "error",
                payload: "Usuario no encontrado"
            })
        }
    }

    static faillogin = async (req, res) => {
        console.log("fallo login");
    
        res.status(400).send({
            status : "error",
            payload: "fallo en el login"
        })
    
    }

    static githubcallback = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(400).send({
                    status: "error",
                    message: "Usuario no encontrado"
                })
            }
    
            const { first_name, last_name, age, email, rol, cart } = req.user;
    
            
            if (!first_name || !last_name || !age || !email || !cart) {
                console.log("se ejecuto este error");
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
    
            // RECORDA Q LUEGO DEL .JSON O .SEND SI ESCRIBIS ALGO DA ERROR
            // res.cookie("jwt-cookie", token, { httpOnly: true, maxAge: 3600000 }).json({
            //     status: "success",
            //     payload: token
            // })
    
            res.cookie(options.COOKIE_WORD, token, { httpOnly: true, maxAge: 3600000 })
    
            res.redirect("/products");
    
        } catch (error) {
            res.status(400).send({
                status: "error",
                payload: "No se logro iniciar sesion con github"
            })
        }
    }

    static logout = async (req, res) => {
        if (req.cookies[options.COOKIE_WORD]) {
            res.clearCookie(options.COOKIE_WORD);
    
            res.redirect('/');
    
        } else {
            res.status(401).send({
                status: "error",
                payload: "No se logro desloguear con exito"
            })
        }
    }

    static current = async (req, res) => {
        try {
            if (!req.user) {
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
            res.status(400).send({
                status: "error",
                payload: "No se logro obtener los datos"
            })
        }
    }

    static failcurret = async (req, res) => {
        console.log("failcurret");
    
        res.status(400).send({
            error: "fallo en obtener los datos del usuario"
        })
    }
}

export { SessionControler };