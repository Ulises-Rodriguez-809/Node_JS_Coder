import fs from 'fs';
import path from 'path';
import __dirname from '../utlis.js';

export default class CartManager {
    constructor(pathFile){
        this.path = path.join(__dirname,`/files/${pathFile}`);
    }

    //FALTA: 
    //NUEVO CARRITO
    //DELETE CARRITO
    //DELETE PRODUCT
    //ACTULIZAR CARRITO

    getCarts = async()=>{
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path,'utf-8');

                const carts = JSON.parse(data);

                return carts;
            }
            else{
                return `La ruta ${this.path} no se encontro`;
            }
        } catch (error) {
            console.log(error);
        }
    }

    getCart = async(idCart)=>{
        try {
            const allCarts = await this.getCarts();
            
            const cartEncontrado = allCarts.find(cart => cart.id === parseInt(idCart));

            cartEncontrado ? cartEncontrado : cartEncontrado = `No se encontro el cart con el id ${idCart}`

            return cartEncontrado;

        } catch (error) {
            console.log(error);
        }
    }

    getProductById = async(idCart,idProduct)=>{
        try {
            const cartData = await this.getCart(idCart);
            const {cart} = cartData;

            let productoEncontrado = cart.find(product => product.id === parseInt(idProduct));

            productoEncontrado ? productoEncontrado : productoEncontrado = `No se encontro el porducto con el con el ID : ${idProduct}`;

            return productoEncontrado;

        } catch (error) {
            console.log(error);
        }
    }

    addCart = async()=>{
        const carts = await this.getCarts();

        const newCart = {
            id : 0,
            products : []
        }

        if (carts.length === 0) {
            newCart.id = 0;
        } else {
            newCart.id = carts[carts.length - 1].id + 1;
        }

        carts.push(newCart);

        await fs.promises.writeFile(this.path,JSON.stringify(carts,null,'\t'));

        return carts;

    }
}