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

    // console.log(" ");
    // console.log(" ");
    // console.log(" ");
    // console.log(req);

    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log("req.user session.routes.js");
    console.log(req.user);

    const serializedUser = {
        id : req.user._id,
        full_name: `${req.user.first_name} ${req.user.last_name}`,
        age: req.user.age,
        email: req.user.email,
        rol : req.user.rol
    }

    const token = jwt.sign(serializedUser,"ulisesSecret",{expiresIn : "1h"}); //OJO con la palabra secreta q puede q no coincida y de eror

    console.log(" ");
    console.log(" ");
    console.log(" ");
    console.log("token");
    console.log(token);
    console.log(" ");
    console.log(" ");
    console.log(" ");


    res.cookie("desafioCookie",token, {maxAge : 3600000}).send({
        status : "success",
        payload : serializedUser
    })

    // 14.1 al req.session le agregamos el obj user
    // req.session.user = {
    //     full_name: `${req.user.first_name} ${req.user.last_name}`,
    //     age: req.user.age,
    //     email: req.user.email
    // }

    // res.send({
    //     status: "success",
    //     payload: req.user
    // })
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

// ruta q se encarga de destruir la session y redirigir al login
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(400).send({
                status: "error",
                message: "No se logro cerrar la session"
            })
        }

        res.redirect('/');
    })
})


export default router;