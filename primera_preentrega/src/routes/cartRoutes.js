import { Router } from 'express';
import CartManager from '../manager/cartManager.js';
import ProductManager from '../manager/productManager.js';


const router = Router();

const PATH = "carts.json";
const cart = new CartManager(PATH);

const PATHPRODUCTS = "productsList.json";
const products = new ProductManager(PATHPRODUCTS);


router.get('/', async (req, res) => {

    try {
        const carts = await cart.getCarts();

        res.send({
            status: "succes",
            carritos: carts
        })

    } catch (error) {
        console.log(error);
    }
})

router.get('/:cartId', async (req, res) => {
    try {
        const id = req.params.cartId;

        const cartEncontrado = await cart.getCart(id);

        const { products } = cartEncontrado;

        res.send({
            status: "succes",
            products
        })

    } catch (error) {
        console.log(error);
    }
})

router.post('/', async (req, res) => {
    const allCarts = await cart.createCart();

    res.send({
        status: "succes",
        allCarts
    })
})

router.post('/:cartId/product/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;

        const { quantity } = req.body;

        let cartEncontrado = {};
        const product = await products.getProductById(productId);

        //caso se encontro el producto
        if (typeof product === "object") {

            //caso se define un valor para quantity
            if (typeof quantity === "number") {
                cartEncontrado = await cart.addProductToCart(cartId, productId, quantity);

                //caso no se define ningun valor para quantity (por defecto 1)
            } else {
                cartEncontrado = await cart.addProductToCart(cartId, productId);
            }

            res.send({
                status: "success",
                msg: "el porducto se agrego con exito",
                cartEncontrado
            });

        }
        //caso id de producto q no exite en el json
        else {
            res.send({
                status: "error",
                msg: `El producto con el id: ${productId}`
            });
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

router.delete('/:cartId', async (req, res) => {

    try {
        const id = req.params.cartId;

        const allCarts = await cart.deleteCart(id);

        if (typeof allCarts === "string") {
            res.send({
                status: "error",
                msg: allCarts
            });

        } else {
            res.send({
                status: "succes",
                msg: `El cart con el id: ${id} se elimino con exito`,
                allCarts
            });
        }

    } catch (error) {
        console.log(error);
    }
})

export default router;