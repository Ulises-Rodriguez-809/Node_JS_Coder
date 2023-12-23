import cartsModel from '../models/cartsModel.js';
import productsModel from '../models/productsModel.js' //el model de products es para el populate

export default class CartManagerDB {

    getCarts = async () => {
        try {
            const carts = await cartsModel.find();

            return carts;

        } catch (error) {
            console.log(error);
        }
    }

    getCartById = async (id) => {
        try {
            // si bien este populate podria haberlo hecho con pre en cartsModel.js, pasa q cada ves q se hace un post para añadir producto al cart se ejecuta el pre
            // y solo pide q sea para el get
            const cart = await cartsModel.findOne({ _id: id }).populate("products.product");

            return cart;

        } catch (error) {
            console.log(error);
        }
    }

    createCart = async () => {
        // hacerlo de esta forma no hace falta ya q cuando creas un cart nuevo este va a tomar la estuctura del schema
        // si lo haces asi estas laburando el doble
        // const newCart = {
        //     products: []
        // }
        // const cart = await cartsModel.create(newCart);

        const cart = await cartsModel.create({});

        return cart;
    }

    addProductToCart = async (idCart, idProduct, quantity = 1) => {
        try {
            const cart = await cartsModel.findOne({ _id: idCart });

            if (!cart) {
                return `el carrito con el id : ${idCart} no existe`;
            }

            const product = await productsModel.findOne({ _id: idProduct });

            if (!product) {
                return `el producto con el id : ${idProduct} no existe`;
            }

            let productsInCart = cart.products; //este es el products q se crea a partier del cart model

            const indexProduct = productsInCart.findIndex(product => product.product._id.toString() === idProduct);

            if (indexProduct === -1) {
                const newProduct = {
                    product: idProduct,
                    quantity
                }

                cart.products.push(newProduct);
            }
            else {
                cart.products[indexProduct].quantity += quantity;

            }

            await cart.save();

            return cart;


        } catch (error) {
            console.log(error);
        }
    }

    deleteCartProducts = async (id) => {
        try {
            const cart = await cartsModel.findOne({ _id: id });

            if (!cart) {
                return `el carrito con el id : ${id} no existe`;
            }

            cart.products = [];

            await cart.save();

            return true


            // if (result["deletedCount"] === 0) {
            //     return `No se logro eliminar el producto con el id: ${id}`;

            // } else {
            //     return true;
            // }

        } catch (error) {
            console.log(error);
        }
    }

    deleteProductToCart = async (idCart, idProduct) => {
        try {
            const cart = await cartsModel.findOne({ _id: idCart });

            if (!cart) {
                return `el carrito con el id : ${id} no existe`;
            }

            const product = await productsModel.findOne({ _id: idProduct });

            if (!product) {
                return `el producto con el id : ${idProduct} no existe`;
            }

            let productsInCart = cart.products;

            const indexProduct = productsInCart.findIndex(product => product.product._id.toString() === idProduct);

            if (indexProduct > -1) {
                cart.products.splice(indexProduct,1);

            }

            await cart.save();

            return true


            // if (result["deletedCount"] === 0) {
            //     return `No se logro eliminar el producto con el id: ${id}`;

            // } else {
            //     return true;
            // }

        } catch (error) {
            console.log(error);
        }
    }
}