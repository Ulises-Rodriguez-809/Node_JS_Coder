import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

router.post("/register", passport.authenticate("register", { passReqToCallback: true, failureRedirect: "/api/sessions/failregister", session: false }), async (req, res) => {

    res.send({
        status: "success",
        message: "Usuario registrado con exito",
        payload: req.user._id
    })
})

router.get('/failregister', async (req, res) => {
    console.log("fallo el registro");

    res.send({
        status: "error",
        message: "No se logro el registro con exito"
    })
})

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin", session: false }), async (req, res) => {

    // DATA: el req.user te lo agrega el passport por defecto cuando hace la autenticacion 
    if (!req.user) {
        return res.status(400).send({
            status: "error",
            message: "Usuario no encontrado"
        })
    }

    console.log("LOGIN");
    console.log(req.user);

    const rol = req.user.email === "adminCoder@gmail.com" ? "admin" : "usuario";

    const user = {
        full_name : `${req.user.first_name} ${req.user.last_name}`,
        age : req.user.age,
        email : req.user.email,
        rol,
        cartID : req.user.cart._id
    }

    const token = jwt.sign(user,"desafio_jwt_secret", {expiresIn : "2h"});

    // enviamos el token por la cookie
    // HttpOnly Cookies evitan que los scripts del lado del cliente accedan a estas cookies, reduciendo significativamente el riesgo de ataques XSS
    // res.cookie("jwt-cookie",token, {httpOnly : true}).json({
    res.cookie("jwt-cookie",token, {httpOnly : true, maxAge: 3600000}).json({
        status : "success",
        payload : token
    })

})

router.get('/faillogin', async (req, res) => {
    console.log("fallo login");

    res.send({
        error: "fallo en el login"
    })
})

// 17- creamos la ruta para loguearse con github
//DATO: https://docs.github.com/es/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#scopes --> aca esta de donde sale el scope
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/" }), async (req, res) => {
    // si todo sale bien al req.session le agregamos la info necesaria para la vista de products, esta la obtenemos del req.user
    req.session.user = {
        full_name: `${req.user.first_name} ${req.user.last_name}`,
        age: req.user.age,
        email: req.user.email
    }

    // recorda q en products tenemos ademas de los productos, la info del usuario
    res.redirect("/products");
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
})

router.get('/failcurret', async (req, res) => {
    console.log("failcurret");

    res.send({
        error: "fallo en obtener los datos del usuario"
    })
})


export default router;