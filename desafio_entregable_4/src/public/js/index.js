//10- instanciamos el socket
//este socket del cliente lo usamos para se comunique con el socket del servidor 
const socket = io();

//mensajes 
socket.on("nuevo-cliente", data => {
    console.log(data);
});

socket.on("resto-de-clientes", data => {
    console.log(data);
});

socket.on("id-socket", data => {
    console.log(data);
});

// 16- obtenemos el elemento q contendra a los productos
const listaProductos = document.getElementById("ul-products");

//18- obtenemos el btn y input para eliminar un producto por el id
const inputId = document.getElementById("input-id");
const btnEliminar = document.getElementById("btnEliminar");

//22- obtenemos el form para agregar un producto
const inputTitle = document.getElementById("input-title");
const inputDescription = document.getElementById("input-description");
const inputCode = document.getElementById("input-code");
const inputPrice = document.getElementById("input-price");
const inputStock = document.getElementById("input-stock");
const inputCategory = document.getElementById("input-category");
const inputThumbnails = document.getElementById("input-thumbnails");
const btnAñadir = document.getElementById("btnAñadir");

//fun para cargar los productos
const loadProducts = (data) => {
    data.forEach(element => {
        const { title, description, code, price, category, id, thumbnails, status } = element;

        const li = document.createElement("li");
        li.innerHTML = `
        id : ${id} <br>
        titulo : ${title} <br>
        descripcion : ${description} <br>
        codigo : ${code} <br>
        precio : ${price} <br>
        categoria : ${category} <br>
        status : ${status} <br>
        thumbnails : ${thumbnails}
        `;

        const br = document.createElement("br");

        listaProductos.append(li, br);
    });
}

// 17- con socket.on lo escuchamos el evento "mostrar-productos" q emitimos en el back
socket.on("mostrar-productos", data => {
    loadProducts(data);
});

//19- funcionalidad para eliminar un producto
btnEliminar.addEventListener("click", () => {
    //cuando le damos al btn eliminar disparamos el nuevo evento
    socket.emit("eliminar-producto", inputId.value);
})

//21-1- recivimos la data con la lista de productos actualizados desde el back
socket.on("producto-eliminado", data => {
    const { allProductsUpdate, id } = data

    //vacio el tag ul xq ya q por mas q haya borrado del json el producto
    //el tag li q estaban antes de la actualizacion de la lista de productos persisten
    listaProductos.innerHTML = "";

    //volvemos a cargar los productos
    loadProducts(allProductsUpdate);

    console.log(`El producto con el id: ${id} fue eliminado de la lista de productos`);
})

//21-2 caso q no se logre eliminar el producto
socket.on("no-se-logro-eliminar-producto", data => {
    Swal.fire({
        title: "Error",
        text: data,
        icon: "error"
    });
})


//23- evento para el btn añadir
btnAñadir.addEventListener("click", () => {
    const obj = {
        title: inputTitle.value,
        description: inputDescription.value,
        code: inputCode.value,
        price: inputPrice.value,
        stock: inputStock.value,
        category: inputCategory.value,
        thumbnails: inputThumbnails.value.split(",")
    }

    socket.emit("añadir-producto", obj);
})

//25.1- recivo el evento del back para el caso q se logro añadir el producto
socket.on("producto-añadido", data => {
    listaProductos.innerHTML = "";

    loadProducts(data);

    console.log(`El producto se añadio con exito`);
})

//25.2- recivo el evento del back para el caso q no se logro añadir el producto
socket.on("no-añadido", data => {
    Swal.fire({
        title: "Error",
        text: data,
        icon: "error"
    });
})