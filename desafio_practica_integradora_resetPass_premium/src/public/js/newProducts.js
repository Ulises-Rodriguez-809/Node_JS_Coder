const form = document.getElementById("nuevo-producto");

const inputIdEliminar = document.getElementById("input-id-eliminar");
const btnEliminar = document.getElementById("btn-eliminar");

const formUpdate = document.getElementById("actualizar-producto");

const owner = document.getElementById("input-owner-add");

owner.readOnly = true;

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

// EL PROFE SUBIO UN EJEM DE COMO HACER Q EL LINK EXPIRE EN SU REPO, HACETE UN PULL DESPUES O MIRATE LA CLASE DE CONSULTA
// AGREGALE A LA COMPRA DE PRODUCTOS EL VERIFI TOKEN PARA Q ASI NO PUEDA AGREGAR PRODUCTOS AL CART SI MODIFICO EL TOKEN
btnEliminar.addEventListener("click",()=>{
    const idProduct = inputIdEliminar.value;

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
                if (json.payload === "premium") {
                    alert(`Error, un usuario premium solo puede eliminar productos creados por el`);
                } else {
                    alert(`No se logro eliminar el producto con el id: ${idProduct}`);
                }
            }
            else{
                alert(`El producto el id: ${idProduct} se elimino con exito`);
            }
        })
})

formUpdate.addEventListener("submit", e => {
    e.preventDefault()

    console.log(e);

    const data = new FormData(formUpdate);

    const obj = {}

    data.forEach((value, key) => obj[key] = value)

    console.log(obj);

    const endpoint = `/api/productsDB/${obj.id}`;

    fetch(endpoint, {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(result => result.json())
        .then(json => {
            console.log(json);

            alert("Producto Actualizado");
        })
});