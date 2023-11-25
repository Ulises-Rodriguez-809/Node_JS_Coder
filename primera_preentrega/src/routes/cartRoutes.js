import {Router} from 'express';
import CartManager from '../manager/cartManager.js';
import ProductManager from '../manager/productManager.js';


const router = Router();

const PATH = "carts.json";
const cart = new CartManager(PATH);

const PATHPRODUCTS = "productsList.json";
const products = new ProductManager(PATHPRODUCTS);


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

router.post('/', async (req,res)=>{
    const allCarts = await cart.createCart();

    res.send({
        status:"succes",
        allCarts
    })
})

router.post('/:cartId/product/:productId', async (req,res)=>{
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;

        const {quantity} = req.body;
        
        const product = await products.getProductById(productId);

        if (typeof product === "object") {

            //si no pasamos una cantidad especifica por defecto aumenta en 1 el quantity
            if (quantity !== undefined) {
                const cartEncontrado = await cart.addProductToCart(cartId,productId,quantity);
                
            } else {
                
            }


        
            //traete el json de product y con un find buscas el id de ese producto
            //solo agrega id del producto y quantity
            //si en primera agregacion pusiste quantity = 2 y despues queres agregar otro solo se modifica el quantity de ese cart, NO crees uno nuevo
        
            res.send({
                status:"succes",
                msg : "se agrego el producto con exito",
                cartEncontrado
            })
            
        } else {
            res.send({
                status:"error",
                product
            })
        }
    
    
        
    } catch (error) {
        console.log(error);
    }
    
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