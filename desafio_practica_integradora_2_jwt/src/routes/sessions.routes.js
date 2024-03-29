import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

router.post("/register", passport.authenticate("register", { passReqToCallback: true, failureRedirect: "/api/sessions/failregister", session: false }), async (req, res) => {

    try {
        res.send({
            status: "success",
            message: "Usuario registrado con exito",
            payload: req.user._id
        })
        
    } catch (error) {
        res.status(400).send({
            status : "error",
            payload : "Usuario ya registrado"
        })
    }

})

router.get('/failregister', async (req, res) => {
    console.log("fallo el registro");

    res.status(400).send({
        status: "error",
        message: "No se logro el registro con exito"
    })
})

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin", session: false }), async (req, res) => {

    try { 
        // DATA: el req.user te lo agrega el passport por defecto cuando hace la autenticacion 
        if (!req.user) {
            return res.status(400).send({
                status: "error",
                message: "Usuario no encontrado"
            })
        }
    
        const rol = req.user.email === "adminCoder@gmail.com" ? "admin" : "usuario";
    
        const user = {
            full_name : `${req.user.first_name} ${req.user.last_name}`,
            age : req.user.age,
            email : req.user.email,
            rol,
            cartID : req.user.cart._id
        }

        if (!user.full_name) {
            return res.status(400).send({
                status : "error",
                msg : "errors"
            })
        }
    
        const token = jwt.sign(user,"desafio_jwt_secret", {expiresIn : "2h"});
    
        // enviamos el token por la cookie
        // HttpOnly Cookies evitan que los scripts del lado del cliente accedan a estas cookies, reduciendo significativamente el riesgo de ataques XSS
        res.cookie("jwt-cookie",token, {httpOnly : true, maxAge: 3600000}).json({
            status : "success",
            payload : token
        })

    } catch (error) {
        res.send({
            status : "error",
            payload : "Usuario no encontrado"
        })
    }
})

router.get('/faillogin', async (req, res) => {
    console.log("fallo login");

    res.status(400).send({
        error: "fallo en el login"
    })

})

// 17- creamos la ruta para loguearse con github
//DATO: https://docs.github.com/es/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#scopes --> aca esta de donde sale el scope
router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }), async (req, res) => { });

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/", session: false }), async (req, res) => {
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

        const token = jwt.sign(user, "desafio_jwt_secret", { expiresIn: "2h" });

        // RECORDA Q LUEGO DEL .JSON O .SEND SI ESCRIBIS ALGO DA ERROR
        // res.cookie("jwt-cookie", token, { httpOnly: true, maxAge: 3600000 }).json({
        //     status: "success",
        //     payload: token
        // })

        res.cookie("jwt-cookie", token, { httpOnly: true, maxAge: 3600000 })

        res.redirect("/products");

    } catch (error) {
        res.status(400).send({
            status: "error",
            payload: "No se logro iniciar sesion con github"
        })
    }
})

// ruta q se encarga de destruir la cookie y redirigir al login
router.get('/logout', (req, res) => {
    if (req.cookies["jwt-cookie"]) {
        res.clearCookie("jwt-cookie");
        
        res.redirect('/');
        
    } else {
        res.status(401).send({
            status : "error",
            payload : "No se logro desloguear con exito"
        })
    }
})

// ruta la cual utilizará el modelo de sesión que estés utilizando, para poder devolver en una respuesta el usuario actual
router.get("/current", passport.authenticate("current", {session : false, failureRedirect : "/api/sessions/failcurret"}), async (req, res) => {
    try {
        if(!req.user){
            return res.status(401).send({
                status : "error",
                payload : "No se encontro el usuario"
            })
        }
    
        res.send({
            status : "success",
            payload : req.user
        })
    } catch (error) {
        res.send({
            status : "error",
            payload : "No se logro obtener los datos"
        })
    }
})

router.get('/failcurret', async (req, res) => {
    console.log("failcurret");

    res.send({
        error: "fallo en obtener los datos del usuario"
    })
})


export default router;