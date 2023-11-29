import {Router} from 'express';

const router = Router();

router.get("/",(req,res)=>{
    //vamos a renderizar la vista home
    res.render("home",{text : "desafio entregable 4"}) //home por nuestra home.handlebars
    //{} es lo q se renderiza de forma dinamica en nuestro home.han...
})

export default router;