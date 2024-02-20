const form = document.getElementById("nuevo-producto");

const inputId = document.getElementById("input-id");
const btnEliminar = document.getElementById("btn-eliminar");

form.addEventListener("submit", e => {
    e.preventDefault()

    console.log(e);

    const data = new FormData(form);

    const obj = {}

    data.forEach((value, key) => obj[key] = value)

    console.log(obj);

    fetch(`/api/productsDB`, {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(result => result.json())
        .then(json => {
            console.log(json);

            alert("Producto agregado");
        })
});

btnEliminar.addEventListener("click",()=>{
    const idProduct = inputId.value;

    const endpoint = `/api/productsDB/${idProduct}`

    const obj = {};

    fetch(endpoint, {
        method: "DELETE",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(result => result.json())
        .then(json => {
            console.log(json)

            if (json.status === "error") {
                alert(`No se logro eliminar el producto con el id: ${idProduct}`);
            }
            else{
                alert(`El producto el id: ${idProduct} se elimino con exito`);
            }
        })
})