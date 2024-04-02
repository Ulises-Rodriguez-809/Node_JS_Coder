import { ERRORS } from '../enum/error.js';
import { productService } from '../respository/index.repository.js';
import { CustomError } from '../services/customError.services.js';
import productErrorOptions from '../services/productError.js';
import jwt from 'jsonwebtoken';

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
                req.logger.warning("No se logro obtener los productos");

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
                result["messagge"].prevLink = `http://localhost:8080/api/productsDB?limit=${options.limit}&page=${result["messagge"].prevPage}${sort ? auxSort : ""}${category ? auxCategory : ""}${stock ? auxStock : ""}`;

            }

            if (result["messagge"].hasNextPage) {
                result["messagge"].nextLink = `http://localhost:8080/api/productsDB?limit=${options.limit}&page=${result["messagge"].nextPage}${sort ? auxSort : ""}${category ? auxCategory : ""}${stock ? auxStock : ""}`;

            }

            if (typeof result !== "object") {
                res.status(400).send({
                    status: "error",
                    message: "Error no se encontro la DB"
                });

            } else {
                res.send({
                    status: "success",
                    result
                })
            }

        }
        catch (error) {
            req.logger.warning("error en la paginacion de los productos");

            next(error);
        }
    }

    static getProductById = async (req, res, next) => {
        try {
            const id = req.params.productId;

            if (!id) {
                req.logger.error(`El id esta vacio`);

                CustomError.createError({
                    name: "No se logro obtener el producto",
                    cause: productErrorOptions.generateGetProductByIdError(id),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            const result = await productService.getById(id);

            if (typeof result === "string") {
                req.logger.warning(`No se logro obtener el producto : ${id}`);

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
            req.logger.error("Error al intentar obtener el producto por el id");

            next(error);
        }
    }

    static addProduct = async (req, res, next) => {
        try {

            const fields = req.body;

            if (!fields) {
                req.logger.error("Campos incompletos");

                CustomError.createError({
                    name: "Campos incompletos",
                    cause: productErrorOptions.generateAddProductError(),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            const result = await productService.add(fields);

            if (typeof result === "string") {
                req.logger.warning("No se logro añadir el producto");

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
            req.logger.error("No se logro añadir el producto al cart");

            next(error);
        }
    }

    static updateProduct = async (req, res, next) => {
        try {
            const id = req.params.productId;
            const fields = req.body;

            if (!id || !fields) {
                req.logger.warning(`Los campos necesarios para actualizar el producto estan vacios`);

                CustomError.createError({
                    name: "No se logro actualizar el producto",
                    cause: productErrorOptions.generateUpdateProductError(id),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            const result = await productService.updateOne(id, fields);

            if (typeof result === "string") {
                req.logger.warning(`No se logro actualizar el producto : ${id}`);

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
            req.logger.error("No se logro actualizar el producto");

            next(error);
        }
    }

    static deleteProduct = async (req, res, next) => {
        try {
            // aca tenemes q obtener el owner del producto
            // luego buscas por el id o email el usuario y ves q rol tiene
            // si es admin puede borrar todo, pero si es premium solo puede borrar los productos q el creo
            const id = req.params.productId;
            let result = null;
            let message = "";

            if (!id) {
                req.logger.error(`El id del producto llego vacio`);

                CustomError.createError({
                    name: "No se logro eliminar el producto",
                    cause: productErrorOptions.generateDeleteProductError(id),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            const tokenInfo = req.cookies["jwt-cookie"];

            const decodedToken = jwt.decode(tokenInfo);

            console.log(decodedToken);
            console.log(decodedToken.rol === "admin");
            console.log(decodedToken.rol === "premium");

            // si el rol es admin le dejo borrar el producto q el quiera
            if (decodedToken.rol === "admin") {
                console.log("entro el admin");
                result = await productService.deleteOne(id);

                message = `El admin logro eliminar con exito el producto con el id: ${id}`;
            }
            // como el middleware checkrol se encarga dejarte acceder al endpoint solo si sos rol "premium" o "admin" no te tenes q preocupar de q te llegue otra cosa 
            else{
                console.log("entro usuario premium");
                const { email } = decodedToken;
    
                const product = await productService.getById(id);
    
                console.log("PRODUCT");
                console.log(product);
    
                const {owner} = product;
                console.log(owner);
                console.log(email === owner);
                if (email === owner) {
                    result = await productService.deleteOne(id);

                    message = `El usuario premium : ${email} logro eliminar con exito el producto que el creo con el id: ${id}`;
                }
                else{
                    console.log("hola");
                    message = `El usuario premium : ${email} no tiene permisos para eliminar el producto con el id: ${id}`;

                    return res.status(400).send({
                        status: "error",
                        message,
                        payload : decodedToken.rol
                    })
                }
            }


            if (typeof result === "string") {
                req.logger.warning(`No se logro eliminar el producto : ${id}`);

                CustomError.createError({
                    name: "No se logro eliminar el producto",
                    cause: productErrorOptions.generateDeleteProductError(id),
                    message: result,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }

            res.send({
                status: "success",
                message,
                payload : decodedToken.rol
            })

        } catch (error) {
            req.logger.error("No se logro eliminar el producto de la DB");

            next(error);
        }
    }
}

export { ProductsControllers }