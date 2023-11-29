import fs from 'fs';
import path from 'path';
import __dirname from '../utlis.js';

export default class ProductManager {
    constructor(pathFile) {
        this.path = path.join(__dirname, `/files/${pathFile}`);
    }

    #keys = [
        "title",
        "description",
        "code",
        "price",
        "status",
        "stock",
        "category",
        "thumbnails"
    ]

    addProduct = async (product) => {

        try {
            const productKeys = Object.keys(product);

            if (!productKeys.includes("thumbnails")) {
                product.thumbnails = [];
                productKeys.push("thumbnails");
            }

            if (!productKeys.includes("status")) {
                product.status = true;
                productKeys.push("status");
            }

            // const sameProps = this.#keys.map(element => productKeys.includes(element));
            const sameProps = this.#keys.map(element => productKeys.includes(element));

            //comprobacion de la misma cantidad de elementos y q todos las keys esten
            if (!sameProps.includes(false) && this.#keys.length === productKeys.length) {

                const productValues = Object.values(product);

                const allValuesValid = productValues.map(element => {
                    if (element === "" || element === undefined || element === null) {
                        return true;
                    }
                })

                //comprobacion de q todos los values estan completos o no son undefined, etc
                if (!allValuesValid.includes(true)) {
                    const productsList = await this.getProducts();
                    //si todo se cumple agregamos el producto
                    const productoEncontrado = productsList.find(element => element.code === product.code);

                    if (productoEncontrado === undefined) {

                        const newProduct = {
                            ...product,
                            id: null
                        }

                        if (productsList.length === 0) {
                            newProduct.id = 0;
                            // product.id = 0;
                        } else {
                            newProduct.id = productsList[productsList.length - 1].id + 1;
                            // product.id = productsList[productsList.length - 1].id + 1
                        }

                        productsList.push(newProduct);
                        // productsList.push(product);

                        await fs.promises.writeFile(this.path, JSON.stringify(productsList, null, '\t'));

                        return productsList;
                    }
                    else{
                        return `Code : ${product.code} invalido`
                    }
                }
            }
            else{
                return "no se pudo añadir el producto"
            }
        } catch (error) {
            console.log(error);
        }
    }

    getProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');

                const productsList = JSON.parse(data);

                return productsList;
            }
            else {
                return [];
            }

        } catch (error) {
            console.log(error);
        }
    }

    getProductById = async (idProducto) => {
        try {
            const productsList = await this.getProducts();

            let productoEncontrado = productsList.find(product => product.id === parseInt(idProducto));

            productoEncontrado ? productoEncontrado : productoEncontrado = `No se encontro el porducto con el con el ID : ${idProducto}`;

            return productoEncontrado;

        } catch (error) {
            console.log(error);
        }

    }

    deleteProduct = async (idProducto) => {
        try {

            let productoEncontrado = await this.getProductById(idProducto);

            if (typeof productoEncontrado !== "string") {
                let productsList = await this.getProducts();

                const newProductsList = productsList.filter(product => product.id !== parseInt(idProducto));

                await fs.promises.writeFile(this.path, JSON.stringify(newProductsList, null, '\t'));

                return `El producto con el id: ${idProducto} fue eliminado con exito`;

            } else {
                return `No se encontro el producto con el id: ${idProducto}`;
            }


        } catch (error) {
            console.log(error);
        }
    }

    updateProduct = async (idProducto, obj) => {
        const productoModificar = await this.getProductById(idProducto);

        if (typeof productoModificar === "string") {
            return productoModificar;
        }
        else {
            const productKeys = Object.keys(obj);
            const sameProps = productKeys.map(element => this.#keys.includes(element));

            if (sameProps.includes(false)) {
                return "Alguno de los campos ingresados no es correcto";
            }
            else {

                const productsList = await this.getProducts();

                let productoIndex = productsList.findIndex(product => product.id === parseInt(idProducto));

                productsList[productoIndex] = {
                    ...productoModificar,
                    ...obj
                };

                await fs.promises.writeFile(this.path, JSON.stringify(productsList, null, '\t'));

                return "El producto se actualizo con exito";
            }
        }

    }
}
