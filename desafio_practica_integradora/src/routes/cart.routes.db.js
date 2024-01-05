import { Router } from 'express';
import cartsModel from '../dao/models/cartsModel.js';
import CartManagerDB from '../dao/managersDB/cartManagerDB.js';
import ProductManagerDB from '../dao/managersDB/productManagerDB.js';


const router = Router();

const cartsDB = new CartManagerDB();
const productsDB = new ProductManagerDB();

//obtener todos los carts
router.get('/', async (req, res) => {
    try {
        const result = await cartsDB.getCarts();
        
        if (typeof result !== "object") {
            return res.status(400).send({
                status: "error",
                message: result
            });

        } else {
            res.send({
                status: "success",
                message: result
            })
        }

    } catch (error) {
        console.log(error);
    }
})

//obtener 1 cart por el id
router.get('/:cartId', async (req, res) => {
    try {
        const id = req.params.cartId;

        const result = await cartsDB.getCartById(id);
        
        if (typeof result === "string") {
            return res.status(400).send({
                status: "error",
                message: result
            });

        } else {
            res.send({
                status: "success",
                message: result
            })
        }

    } catch (error) {
        console.log(error);
    }
})

//crear un nuevo cart y añadirlo a la DB
router.post('/', async (req, res) => {

    const cart = await cartsDB.createCart();

    res.send({
        status: "succes",
        cart
    })
})

//añadir un producto (id y quantity) a un cart (por el id)
router.post('/:cartId/product/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const { quantity } = req.body;

        const product = await productsDB.getProductById(productId);

        if (typeof product === "object") {
            const result = await cartsDB.addProductToCart(cartId,productId,quantity);
            
            return res.send({
                status: "success",
                message: result
            })

        }else{ //caso q no exista el producto
            res.status(400).send({
                status: "error",
                message: product
            });
        }

    } catch (error) {
        console.log(error);
    }

})

//eliminar un cart
router.delete('/:cartId', async (req, res) => {

    try {
        const id = req.params.cartId;
        
        const result = await cartsDB.deleteCart(id);

        if (typeof result === "string") {
            return res.status(400).send({
                status: "error",
                message: result
            });

        } else {
            res.send({
                status: "success",
                message: `Se logro eliminar con exito el cart con el id: ${id}`
            })
        }

    } catch (error) {
        console.log(error);
    }
})

export default router;