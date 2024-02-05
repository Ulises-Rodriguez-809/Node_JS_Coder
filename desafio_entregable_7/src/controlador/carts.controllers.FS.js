import CartManager from '../dao/manager/cartManager.js';
import ProductManager from '../dao/manager/productManager.js';


const PATH = "carts.json";
const cart = new CartManager(PATH);

const PATHPRODUCTS = "productsList.json";
const products = new ProductManager(PATHPRODUCTS);

class CartsControllersFS{
    static getCarts = async (req, res) => {

        try {
            const carts = await cart.getCarts();
    
            if (typeof carts === "object") {
                res.send({
                    status: "succes",
                    carritos: carts
                })
            } else {
                res.send({
                    status: "error",
                    msg : carts
                })
            }
    
        } catch (error) {
            console.log(error);
        }
    }

    static getCartById = async (req, res) => {
        try {
            const id = req.params.cartId;
    
            const cartEncontrado = await cart.getCart(id);
    
            const { products } = cartEncontrado;
    
            if (typeof products === "object") {
                res.send({
                    status: "succes",
                    products
                })
            } else {
                res.send({
                    status: "error",
                    msg : cartEncontrado
                })
            }
            
    
        } catch (error) {
            console.log(error);
        }
    }

    static createCart = async (req, res) => {
        const allCarts = await cart.createCart();
    
        res.send({
            status: "succes",
            allCarts
        })
    }

    static addProductToCart = async (req, res) => {
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
    
    }

    static deleteCart = async (req, res) => {

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
    }
}

export {CartsControllersFS}