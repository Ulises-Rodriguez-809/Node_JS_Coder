//fun para añadir productos
export const añadirProductos = async (arr,obj)=>{
    // arr.forEach(async (producto) => await obj.addProduct(producto));

    for (let i = 0; i < arr.length; i++) {
        await obj.addProduct(arr[i]);
    }
}

//fun para obtener la lista de productos
export const obtenerProductos = async (obj)=>{
    const productsList = await obj.getProducts();

    return productsList;
}

//fun para obtener el producto por su id
export const obtenerProductoPorId = async (obj,id)=>{
    const product = await obj.getProductById(id);

    return product
}

export const eliminarProductoPorId = async (obj,id)=>{
    const msg = await obj.deleteProduct(id);

    return msg
}

export const actualizarProducto = async (obj,id,newProps)=>{
    const msg = await obj.updateProduct(id,newProps); 

    return msg;
}