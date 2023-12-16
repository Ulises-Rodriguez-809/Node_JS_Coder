import {Router} from 'express'
import messagesModel from '../dao/models/messagesModel.js';


const router = Router();

router.get("/",async (req,res)=>{
    try {
        const messages = await messagesModel.find();

        res.send({
            status: "success",
            message: messages
        })

    } catch (error) {
        console.log(error);
    }
})


export default router;