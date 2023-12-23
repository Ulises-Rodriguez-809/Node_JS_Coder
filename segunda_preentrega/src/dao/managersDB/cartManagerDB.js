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
            const cart = await cartsModel.find({ _id: id });

            return cart;
            
        } catch (error) {
            console.log(error);
        }
    }

    createCart = async () => {
        // const newCart = {
        //     products: []
        // }

        // const cart = await cartsModel.create(newCart);

        const cart = await cartsModel.create({}); //ejem profe
        // const cart = await cartsModel.create(); //deberia de andar

        return cart;
    }

    addProductToCart = async (idCart, idProduct, quantity = 1) => {
        try {
            const cart = await cartsModel.findOne({_id:idCart});
            
            if (!cart) {
                return {
                    status: "error",
                    messagge : `el carrito con el id : ${idCart} no existe`
                }
            } 

            const product = await productsModel.findOne({_id:idProduct});

            if (!product) {
                return {
                    status: "error",
                    messagge : `el producto con el id : ${idProduct} no existe`
                }
            }

            let productsInCart = cart.products; //este es el products de cart model

            const indexProduct = productsInCart.findIndex(product => product.product === idProduct);

            if (indexProduct = -1) {
                const newProduct = {
                    product : idProduct,
                    quantity
                }
                
                cart.products.push(newProduct);
            }
            else{
                cart.products[indexProduct].quantity += quantity;

            }

            await cart.save();

            return cart 
            // {
            //     status: "success",
            //     messagge : `el producto con el id : ${idProduct} se agrego correctamente`
            // }

            
            // let result = "";

            // const cart = await this.getCartById(idCart);


            // if (typeof cart === "string") { //caso id del cart no encontrado
            //     return cart;

            // } else { //caso id cart encontrado

            //     const idProductFound = cart[0]["products"].findIndex(product => product.id === idProduct);

            //     if (idProductFound > -1) { //caso producto ya agregado
            //         console.log("producto ya agregado");
            //         cart[0]["products"][idProductFound].quantity += quantity;

            //         result = await cartsModel.updateOne({ _id: idCart }, { $set: {"products" : cart[0]["products"]} });


            //     } else {
            //         console.log("producto nuevo")
            //         cart[0]["products"].push({
            //             id: idProduct,
            //             quantity
            //         })

            //         result = await cartsModel.updateOne({ _id: idCart }, { $set: {"products" : cart[0]["products"]} });
            //     }

            //     if (result.modifiedCount === 1) {
            //         const allProducts = await this.getCartById(idCart);

            //         return allProducts;

            //     } else {
            //         return `No se logro agregar el producto con el id: ${idProduct} al cart con el id: ${idCart}`
            //     }
            // }

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