//10- instanciamos el socket
//este socket del cliente lo usamos para se comunique con el socket del servidor 
const socket = io();

// 16- obtenemos el elemento q contendra a los productos
const listaProductos = document.getElementById("ul-products");

socket.on("nuevo-cliente",data=>{
    console.log(data);
});

socket.on("resto-de-clientes",data=>{
    console.log(data);
});

socket.on("id-socket",data=>{
    console.log(data);
});


// 17- con socket.on lo escuchamos el evento "mostrar-productos" q emitimos en el back
socket.on("mostrar-productos", data => {

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
});

