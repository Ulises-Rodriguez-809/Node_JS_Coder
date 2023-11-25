import fs from 'fs';
import path from 'path';
import __dirname from '../utlis.js';

export default class CartManager {
    constructor(pathFile) {
        this.path = path.join(__dirname, `/files/${pathFile}`);
    }

    //FALTA: 
    //DELETE CARRITO
    //DELETE PRODUCT
    //ACTULIZAR CARRITO

    getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');

                const carts = JSON.parse(data);

                return carts;
            }
            else {
                return `La ruta ${this.path} no se encontro`;
            }
        } catch (error) {
            console.log(error);
        }
    }

    getCart = async (idCart) => {
        try {
            const allCarts = await this.getCarts();

            const cartEncontrado = allCarts.find(cart => cart.id === parseInt(idCart));

            cartEncontrado ? cartEncontrado : cartEncontrado = `No se encontro el cart con el id ${idCart}`

            return cartEncontrado;

        } catch (error) {
            console.log(error);
        }
    }

    createCart = async () => {
        const carts = await this.getCarts();

        const newCart = {
            id: 0,
            products: []
        }

        if (carts.length === 0) {
            newCart.id = 0;
        } else {
            newCart.id = carts[carts.length - 1].id + 1;
        }

        carts.push(newCart);

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

        return carts;

    }

    addProductToCart = async (idCart,idProduct,quantity = 1) => {
        try {
            //obtengo todos los carts para poder modificar el json lugo
            const allCarts = await this.getCarts();
            //obtengo el cart donde se quiere agregar el producto para asi no tener q estar buscandolo dentro de todo el array de carritos
            const cartEncontrado = await this.getCart(idCart);

            //el index del cart para poder indcarle a allCarts la posicion del elemento q tiene q modificar
            const cartIndex = allCarts.findIndex(cart => cart.id === parseInt(idCart));
            //productIndex para modificar el quantity en caso de q el producto ya este agregado
            const productIndex = cartEncontrado["products"].findIndex(product => product.id === parseInt(idProduct));

            
            //caso en el q el producto ya se encuentre agregado
            if (productIndex > -1) { 
                cartEncontrado["products"][productIndex].quantity = quantity;

                
                cartEncontrado["products"].push(newProduct);
                
                //reemplazamos el cart q coicida con el id con por si mismo pero con los el array de productos modificado
                allCarts[cartIndex] = cartEncontrado;
                
            }
            //caso nuevo producto
            else{
                const newProduct = {
                    id : parseInt(idProduct),
                    quantity
                }

                cartEncontrado["products"].push(newProduct);

                allCarts[cartIndex] = cartEncontrado;
            }

            await fs.promises.writeFile(this.path,JSON.stringify(allCarts,null,'\t'));

            return cartEncontrado;
        } catch (error) {
            console.log(error);
        }
    }
}