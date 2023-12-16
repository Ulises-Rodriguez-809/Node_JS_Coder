import { Router } from 'express';
import cartsModel from '../dao/models/cartsModel.js';


const router = Router();


//obtener todos los carts
router.get('/', async (req, res) => {

    try {
        const carts = await cartsModel.find();

        res.send({
            status: "success",
            message: carts
        })

    } catch (error) {
        console.log(error);
    }
})

//obtener 1 cart por el id
router.get('/:cartId', async (req, res) => {
    try {
        const id = req.params.cartId;

        const cart = await cartsModel.find({ _id: id });

        res.send({
            status: "success",
            message: cart
        })


    } catch (error) {
        console.log(error);
    }
})

//crear un nuevo cart y añadirlo al json de carts
router.post('/', async (req, res) => {
    const allCarts = await cartsModel.create(cart);

    res.send({
        status: "succes",
        allCarts
    })
})

//añadir un producto (id y quantity) a un cart (por el id)
// router.post('/:cartId/product/:productId', async (req, res) => {
//     try {
//         const cartId = req.params.cartId;
//         const productId = req.params.productId;

//         const { quantity } = req.body;

//         let cartEncontrado = {};
//         const product = await products.getProductById(productId);

//         //caso se encontro el producto
//         if (typeof product === "object") {

//             //caso se define un valor para quantity
//             if (typeof quantity === "number") {
//                 cartEncontrado = await cart.addProductToCart(cartId, productId, quantity);

//                 //caso no se define ningun valor para quantity (por defecto 1)
//             } else {
//                 cartEncontrado = await cart.addProductToCart(cartId, productId);
//             }

//             res.send({
//                 status: "success",
//                 msg: "el porducto se agrego con exito",
//                 cartEncontrado
//             });

//         }
//         //caso id de producto q no exite en el json
//         else {
//             res.send({
//                 status: "error",
//                 msg: `El producto con el id: ${productId}`
//             });
//         }

//     } catch (error) {
//         console.log(error);
//     }

// })

//eliminar un cart
router.delete('/:cartId', async (req, res) => {

    try {
        const id = req.params.cartId;

        const allCarts = await cartsModel.deleteOne({ _id: id });

        res.send({
            status: "error",
            msg: allCarts
        });

    } catch (error) {
        console.log(error);
    }
})

export default router;