import { Router } from 'express';
import CartManagerDB from '../dao/managersDB/cartManagerDB.js';

const router = Router();

const cartsDB = new CartManagerDB();

//obtener todos los carts
router.get('/', async (req, res) => {
    try {
        const result = await cartsDB.getCarts();

        if (typeof result !== "object") {
            res.status(400).send({
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
            res.status(400).send({
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

        const result = await cartsDB.addProductToCart(cartId, productId, quantity);

        if (typeof result === "string") {
            res.status(400).send({
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

// ACTUALIZA EL ARRAY DE PRODUCTOS DEL CARRITO CON EL NUEVO ARRAY DE PRODUCTOS
// este recibe un array completo con todos los nuevos ids de los productos y cantidades nuevas
router.put('/:cartId', async (req, res) => {

})

// ACTUALIZAR EL QUANTITY (ESTO LO TENES EN POST, PASALO ABAJO, TAMBIEN VAS A TENER Q MODIFICAR EL MANAGER)
// actualizar solo la cantidad q corresponda al id cart y id producto
router.put('/:cartId/products/:productId', async (req, res) => {

})

//eliminar la lista de productos de un cart por id
router.delete('/:cartId', async (req, res) => {

    try {
        const id = req.params.cartId;

        const result = await cartsDB.deleteCartProducts(id);

        if (typeof result === "string") {
            res.status(400).send({
                status: "error",
                message: result
            });

        } else {
            res.send({
                status: "success",
                message: `Los productos del cart: ${id} se eliminaron con exito`
            })
        }

    } catch (error) {
        console.log(error);
    }
})

// ELIMINAR EL PRODUCTO DEL CARRITO
router.delete('/:cartId/products/:productId', async (req, res) => {

    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;

        const result = await cartsDB.deleteProductToCart(cartId, productId);

        if (typeof result === "string") {
            res.status(400).send({
                status: "error",
                message: result
            });

        } else {
            res.send({
                status: "success",
                message: `Se logro eliminar con exito el cart con el id: ${cartId}`
            })
        }

    } catch (error) {
        console.log(error);
    }
})


export default router;