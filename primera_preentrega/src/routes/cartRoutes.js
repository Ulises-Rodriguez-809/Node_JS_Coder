import {Router} from 'express';
import CartManager from '../manager/cartManager.js';


const router = Router();

const PATH = "carts.json";
const cart = new CartManager(PATH);

router.get('/', async (req,res)=>{

    try {
        const carts = await cart.getCarts();
    
        res.send({
            status:"succes",
            carritos: carts
        })
        
    } catch (error) {
        console.log(error);
    }
})

router.get('/:cartId', async (req,res)=>{
    try {
        const id = req.params.cartId;
    
        const cartEncontrado = await cart.getCart(id);
    
        res.send({
            status:"succes",
            msg:cartEncontrado
        })
        
    } catch (error) {
        console.log(error);
    }
})

router.post('/', async (req,res)=>{ //creo
    res.send({
        status:"succes",
        msg:"Ruta POST CART"
    })
})

router.post('/:cid/product/:pid', async (req,res)=>{ //creo
    const cid = req.params.cid;
    const pid = req.params.pid;

    res.send({
        status:"succes",
        msg:`Ruta POST CART - Agrego producto al carrito. CID: ${cid} - PID: ${pid}`
    })
})

// router.put('/:cid', async (req,res)=>{
//     const cid = req.params.cid;
//     res.send({
//         status:"succes",
//         msg:`Ruta PUT de CART con ID: ${cid}`
//     })
// })

// router.delete('/:cid', async (req,res)=>{
//     const cid = req.params.cid;
//     res.send({
//         status:"succes",
//         msg:`Ruta DELETE de CART con ID: ${cid}`
//     })
// })

export default router;