import {productService} from '../respository/index.repository.js';

class ProductsControllers{
    static getProductsPaginate = async (req, res) => {
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
    
                // console.log(`http://localhost:8080/api/productsDB?limit=${options.limit}&page=${result["messagge"].prevPage}${sort && auxSort}${category ? auxCategory : ""}${stock ? auxStock : ""}`);
    
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
        }
    }

    static getProductById =async (req, res) => {
        try {
            const id = req.params.productId;
    
            const result = await productService.getById(id);
    
            if (typeof result === "string") {
                res.status(400).send({
                    status: "error",
                    message: result
                });
    
            } else {
                res.send({
                    status: "success",
                    message: result
                })
            }
    
        } catch (error) {
            console.log(error);
        }
    }

    static addProduct = async (req, res) => {
        try {
    
            const fields = req.body;

            console.log(req.body);
    
            const result = await productService.add(fields);
    
            if (typeof result === "string") {
                res.status(400).send({
                    status: "error",
                    message: result
                });
    
            }
            else {
                res.send({
                    status: "success",
                    message: result
                })
            }
    
        } catch (error) {
            console.log(error);
        }
    }

    static updateProduct = async (req, res) => {
        try {
            const id = req.params.productId;
            const fields = req.body;
    
            const result = await productService.updateOne(id, fields);
    
            if (typeof result === "string") {
                res.status(400).send({
                    status: "error",
                    message: result
                });
    
            } else {
                res.send({
                    status: "success",
                    message: `Se modifico con exito el producto con el id: ${id}`
                })
            }
    
        } catch (error) {
            console.log(error);
        }
    }

    static deleteProduct = async (req, res) => {
        try {
            const id = req.params.productId;

            console.log(id);
    
            const result = await productService.deleteOne(id);
    
    
            if (typeof result === "string") {
                res.status(400).send({
                    status: "error",
                    message: result
                });
    
            } else {
                res.send({
                    status: "success",
                    message: `Se logro eliminar con exito el producto con el id: ${id}`
                })
            }
    
        } catch (error) {
            console.log(error);
        }
    }
}

export {ProductsControllers}