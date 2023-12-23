import productsModel from '../models/productsModel.js';

export default class ProductManagerDB {

    getProducts = async (query,options) => {
        // profe
        const products = await productsModel.paginate(
            {
                ...query
            },
            {
                ...options
            }
        )

        return {
            status : "success",
            messagge : products
        }

        // yo
        try {
            const products = await productsModel.find();

            return products;

        } catch (error) {
            console.log(error);
        }
    }

    getProductById = async (id) => {
        // profe 
        const product = await productsModel.findOne({_id:id});

        return {
            status : "success",
            messagge : product
        }


        try {
            const product = await productsModel.find({ _id: id });

            // FIJATE Q ESTOS IF ELSE YA NO TE HACEN FALTA XQ LOS TRABAJAS EN EL MANAJER pero no en todos
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
        try {
            const result = await productsModel.deleteOne({ _id: id });

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