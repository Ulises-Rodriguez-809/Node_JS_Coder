import {Router} from 'express';
import productsModel from '../dao/models/productsModel.js';


const router = Router();

router.get("/",async (req,res)=>{
    try {
        const products = await productsModel.find();

        res.send({
            status: "success",
            message: products
        })

    } catch (error) {
        console.log(error);
    }
})


export default router;