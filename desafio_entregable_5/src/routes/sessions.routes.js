import { Router } from 'express';
import userModel from '../dao/models/user.model.js';

const router = Router();

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    const userFound = await userModel.findOne({ email });

    if (userFound) {
        return res.status(400).send({
            status: "error",
            message: `Lo siento pero ya hay un usuario registrado con el mail ${email}`
        })
    }

    const newUser = {
        first_name,
        last_name,
        email,
        age,
        password
    }

    const result = await userModel.create(newUser);

    res.send({
        status: "success",
        message: "Usuario registrado con exito"
    })

})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const adminData = {
        full_name : "Coder House",
        email : "adminCoder@coder.com",
        age : 10,
        password : "adminCod3r123"
    }

    // caso admin
    if (email === adminData.email) {
        // si es admin añadimos al req.session.user los dato del admin
        // estos son tomados luego en el view.routes.js
        req.session.user = {...adminData};

    }else{
        const userFound = await userModel.findOne({ email, password });
    
        if (!userFound) {
            return res.status(400).send({
                status: "error",
                message: "Lo siento ingresaste mal lo datos"
            })
        }
    
        req.session.user = {
            full_name: `${userFound.first_name} ${userFound.last_name}`,
            email: userFound.email,
            age: userFound.age,
            password: userFound.password
        }
    }

    res.send({
        status: "success",
        payload: req.session.user,
        message: "logueado con exito"
    })
})

// ruta q se encarga de destruir la session y redirigir al login
router.get('/logout',(req,res)=>{
    req.session.destroy(err =>{
        if (err) {
            return res.status(400).send({
                status : "error",
                message : "No se logro cerrar la session"
            })
        }

        res.redirect('/');
    })
})


export default router;