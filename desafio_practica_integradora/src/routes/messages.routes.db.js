import {Router} from 'express'

const router = Router();

router.get('/chat', async (req,res)=>{
    res.render('chat', { title: "Chat con socket y mongo"});
})


export default router;