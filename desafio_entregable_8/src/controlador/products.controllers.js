import { ERRORS } from '../enum/error.js';
import { productService } from '../respository/index.repository.js';
import { CustomError } from '../services/customError.services.js';
import productErrorOptions from '../services/productError.js';

class ProductsControllers {
    static getProductsPaginate = async (req, res, next) => {
        try {

            const { limit, page, sort, category, stock } = req.query;
            const query = {};

            const auxSort = `&sort=${sort}`;
            const auxCategory = `&category=${category}`;
            const auxStock = `&stock=${stock}`;

            const options = {
                limit: limit ?? 10,
                page: page ?? 1,
                sort: { price: sort === "asc" ? 1 : -1 },
                lean: true
            }

            if (category) {
                query.category = category;
            }
            else if (stock) {
                query.stock = parseInt(stock);
            }

            const result = await productService.getAll(query, options);

            if (!result) {
                CustomError.createError({
                    name: "No se logro obtener los productos",
                    cause: productErrorOptions.generateGetAllProductsError(),
                    message: "Error buscando todos los productos",
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            const totalPages = result["messagge"]["totalPages"];

            if (page > totalPages) {
                // este return es para q el resto del codigo no se ejecute ya q si bien no influye en el funcionamiento por consola tira error
                // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
                return res.status(400).send({
                    status: "error",
                    message: `El numero de pagina ingresado: ${page} no es correcto, con el limit: ${limit} el total de paginas disponibles es de : ${totalPages}, ingresar un page que se encuentre entre los valores de paginas totales`,
                    link: `http://localhost:8080/api/productsDB?limit=${options.limit}&page=1`
                });
            }

            // tema del LINK
            if (result["messagge"].hasPrevPage) {
                console.log("tine pagina anterior");

                result["messagge"].prevLink = `http://localhost:8080/api/productsDB?limit=${options.limit}&page=${result["messagge"].prevPage}${sort ? auxSort : ""}${category ? auxCategory : ""}${stock ? auxStock : ""}`;

            }

            if (result["messagge"].hasNextPage) {
                console.log("tiene pagina siguiente");

                result["messagge"].nextLink = `http://localhost:8080/api/productsDB?limit=${options.limit}&page=${result["messagge"].nextPage}${sort ? auxSort : ""}${category ? auxCategory : ""}${stock ? auxStock : ""}`;

            }

            if (typeof result !== "object") {
                res.status(400).send({
                    status: "error",
                    message: "Error no se encontro la DB"
                });

            } else {
                res.send({
                    result
                })
            }

        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    static getProductById = async (req, res, next) => {
        try {
            const id = req.params.productId;

            const result = await productService.getById(id);

            if (typeof result === "string") {
                CustomError.createError({
                    name: "No se logro obtener el producto",
                    cause: productErrorOptions.generateGetProductByIdError(id),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })

            }
            
            res.send({
                status: "success",
                message: result
            })

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static addProduct = async (req, res, next) => {
        try {

            const fields = req.body;

            const result = await productService.add(fields);

            if (typeof result === "string") {
                CustomError.createError({
                    name: "No se logro agregar el producto",
                    cause: productErrorOptions.generateAddProductError(),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })

            }

            res.send({
                status: "success",
                message: result
            })

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static updateProduct = async (req, res, next) => {
        try {
            const id = req.params.productId;
            const fields = req.body;

            const result = await productService.updateOne(id, fields);

            if (typeof result === "string") {
                CustomError.createError({
                    name: "No se logro actualizar el producto",
                    cause: productErrorOptions.generateUpdateProductError(id),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })

            } 
            
            res.send({
                status: "success",
                message: `Se modifico con exito el producto con el id: ${id}`
            })

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static deleteProduct = async (req, res, next) => {
        try {
            const id = req.params.productId;

            const result = await productService.deleteOne(id);

            if (typeof result === "string") {
                CustomError.createError({
                    name: "No se logro eliminar el producto",
                    cause: productErrorOptions.generateDeleteProductError(id),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })

            }
            
            res.send({
                status: "success",
                message: `Se logro eliminar con exito el producto con el id: ${id}`
            })

        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export { ProductsControllers }