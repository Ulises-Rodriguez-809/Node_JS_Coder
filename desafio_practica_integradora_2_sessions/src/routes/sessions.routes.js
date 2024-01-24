import { Router } from 'express';
import userModel from '../dao/models/userModel.js';
import passport from 'passport';

const router = Router();

// router.post("/register", async (req, res) => {
//     const { first_name, last_name, email, age, password } = req.body;

//     const userFound = await userModel.findOne({ email });

//     if (userFound) {
//         return res.status(400).send({
//             status: "error",
//             message: `Lo siento pero ya hay un usuario registrado con el mail ${email}`
//         })
//     }

//     const newUser = {
//         first_name,
//         last_name,
//         email,
//         age,
//         password
//     }

//     const result = await userModel.create(newUser);

//     res.send({
//         status: "success",
//         message: "Usuario registrado con exito"
//     })

// })


/* 12- reacondicionamos el register para q quede mas limpio */
router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), async (req, res) => {

    res.send({
        status: "success",
        message: "Usuario registrado con exito"
    })
})

// 13- creamos la ruta para el caso de q haya un error redirija a esta ruta e indique q hubo un error
router.get('/failregister', async (req, res) => {
    console.log("fallo el registro");

    res.send({
        status: "error",
        message: "No se logro el registro con exito"
    })
})

// router.post("/login",async (req, res) => {
//     const { email, password } = req.body;

//     const adminData = {
//         full_name : "Coder House",
//         email : "adminCoder@coder.com",
//         age : 10,
//         password : "adminCod3r123"
//     }

//     // caso admin
//     if (email === adminData.email) {
//         // si es admin añadimos al req.session.user los dato del admin
//         // estos son tomados luego en el view.routes.js
//         req.session.user = {...adminData};

//     }else{
//         const userFound = await userModel.findOne({ email, password });

//         if (!userFound) {
//             return res.status(400).send({
//                 status: "error",
//                 message: "Lo siento ingresaste mal lo datos"
//             })
//         }

//         req.session.user = {
//             full_name: `${userFound.first_name} ${userFound.last_name}`,
//             email: userFound.email,
//             age: userFound.age,
//             password: userFound.password
//         }
//     }

//     res.send({
//         status: "success",
//         payload: req.session.user,
//         message: "logueado con exito"
//     })
// })

/* 14- reacondicionamos el login */
router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), async (req, res) => {

    // DATA: el req.user te lo agrega el passport por defecto cuando hace la autenticacion (por si te preguntabas de donde salia)
    if (!req.user) {
        return res.status(400).send({
            status: "error",
            message: "Usuario no encontrado"
        })
    }

    // 14.1 al req.session le agregamos el obj user
    req.session.user = {
        full_name: `${req.user.first_name} ${req.user.last_name}`,
        age: req.user.age,
        email: req.user.email
    }

    res.send({
        status: "success",
        payload: req.user
    })
})

// 15- creo la ruta para el caso de error en el el login
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