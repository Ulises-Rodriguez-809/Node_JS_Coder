import {Router} from 'express';
import CartManager from '../manager/cartManager.js';


const router = Router();
const cart = new CartManager('./files/carts.json');

let cartsList = [];

//mostar todos los carritos
router.get("/",async (req,res)=>{    
    cartsList = await cart.getCarts();
    
    res.send({cartsList})
});

//mostrar un carrito especifico dependiendo su id
router.get("/:idCart",async (req,res)=>{

    let id = req.params.idCart;

    const cartSeleccionado = await cart.getCart(id); //acordate q lo q te biene por la url es texto y tus id en el .json son numeros

    (typeof cartSeleccionado === "object") ? res.json({cartSeleccionado}) : res.send(`<h1>No se encontro el cart con el id: ${id}</h1>`);
});

router.get('/:idCart/products', async (req,res)=>{
    let id = req.params.idCart;
    
    const cartSeleccionado = await cart.getCart(id);

    if (typeof cartSeleccionado === "object") {
        const products = cartSeleccionado["cart"];
    
        res.json({products});
    }

});

//mostrar un producto de un carrito dependiendo de sus id
router.get('/:idCart/products/:idProducto', async (req,res)=>{
    let idCart = req.params.idCart;
    let idProduct = req.params.idProducto;

    const product = await cart.getProductById(idCart,idProduct);

    (typeof product === "object") ? res.json({product}) : res.send(`<h1>No se encontro el producto con el id: ${idProduct}</h1>`);
});

export default router;