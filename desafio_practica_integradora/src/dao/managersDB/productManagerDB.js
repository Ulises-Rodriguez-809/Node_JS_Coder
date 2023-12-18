import __dirname from '../../utils.js';
import productsModel from '../models/productsModel.js';

export default class ProductManagerDB {

    getProducts = async () => {
        try {
            const products = await productsModel.find();

            if (products.length === 0) {
                return "No se encontro la colleccion";

            } else {
                return products;
            }

        } catch (error) {
            console.log(error);
        }
    }

    getProductById = async (id) => {
        try {
            const product = await productsModel.find({ _id: id });

            if (product.length === 0) {
                return `No se encontro el producto con el id: ${id}`;

            } else {
                return product;
            }

        } catch (error) {
            console.log(error);
        }
    }

    addProduct = async (fields) => {
        const { title,
            description,
            code,
            price,
            status = true,
            stock,
            category,
            thumbnails = [] } = fields;

        let newProduct = {};

        const productFind = await productsModel.findOne({ code: code });

        if (!title || !description || !code || !price || !stock || !category) {
            return "Valores incompletos";

        }
        else if (productFind) {
            return "El codigo del producto ya se encuentra en uso";

        } else {
            newProduct = {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            }
        }

        const product = await productsModel.create(newProduct);

        return newProduct;
    }

    updateProduct = async (id, fields) => {
        try {

            const updateProduct = {
                ...fields
            }

            const result = await productsModel.updateOne({ _id: id }, { $set: updateProduct });

            if (result["modifiedCount"] === 1) {
                return true;

            } else {
                // para porbar esto en postman el id debe de ser el mismo largo q los id q te genera mongo
                //y tiene q ser hexadecimal [0...9], [a..f] y [A...F]:
                //657f7256adc125700f39a8cJKL --> esto va a dar error ya q no existe hexadecimal para J,K,L
                return `No se logro modificar el producto con el id: ${id}`;
            }

        } catch (error) {
            console.log(error);
        }
    }

    deleteProduct = async (id) => {

        const result = await productsModel.deleteOne({ _id: id });

        if (result["deletedCount"] === 0) {
            return `No se logro eliminar el producto con el id: ${id}`;

        } else {
            return true;
        }
    }

}