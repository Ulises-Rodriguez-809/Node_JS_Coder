import __dirname from '../../utils.js';
import cartsModel from '../models/cartsModel.js';

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
            const cart = await cartsModel.find({ _id: id });

            if (cart.length === 0) {
                return `No se encontro el producto con el id: ${id}`;

            } else {
                return cart;
            }

        } catch (error) {
            console.log(error);
        }
    }

    createCart = async () => {
        const newCart = {
            products: []
        }

        const cart = await cartsModel.create(newCart);

        return cart;
    }

    addProductToCart = async (idCart, idProduct, quantity = 1) => {
        try {
            let result = "";

            const cart = await this.getCartById(idCart);

            if (typeof cart === "string") { //caso id del cart no encontrado
                return cart;

            } else { //caso id cart encontrado

                const idProductFound = cart[0]["products"].findIndex(product => product.id === idProduct);

                if (idProductFound > -1) { //caso producto ya agregado
                    console.log("producto ya agregado");
                    cart[0]["products"][idProductFound].quantity += quantity;

                    result = await cartsModel.updateOne({ _id: idCart }, { $set: {"products" : cart[0]["products"]} });


                } else {
                    console.log("producto nuevo")
                    cart[0]["products"].push({
                        id: idProduct,
                        quantity
                    })

                    result = await cartsModel.updateOne({ _id: idCart }, { $set: {"products" : cart[0]["products"]} });
                }

                if (result.modifiedCount === 1) {
                    const allProducts = await this.getCartById(idCart);

                    return allProducts;

                } else {
                    return `No se logro agregar el producto con el id: ${idProduct} al cart con el id: ${idCart}`
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    deleteCart = async (id) => {
        try {
            const result = await cartsModel.deleteOne({ _id: id });

            if (result["deletedCount"] === 0) {
                return `No se logro eliminar el producto con el id: ${id}`;

            } else {
                return true;
            }

        } catch (error) {
            console.log(error);
        }
    }
}