const idCart = document.getElementById("id-cart").textContent;

const arrayForms = document.querySelectorAll(".form");

const arrayBtnsPlus = document.querySelectorAll(".plus");
const arrayBtnsMinus = document.querySelectorAll(".minus");
const arrayCount = document.querySelectorAll(".count");

const finalizarCompra = document.querySelector(".finalizarCompra");

finalizarCompra.addEventListener("click", () => {
    // window.location.replace('/ticket');

    const endpoint = `/api/cartsDB/${idCart}/purchase`;

    const obj = {};

    fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(result => result.json())
        .then(json => {
            console.log(json)

            alert("Compra finalizada");
        })

})

arrayBtnsPlus.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const count = parseInt(arrayCount[index].value);
        arrayCount[index].value = count + 1;
    })
})

arrayBtnsMinus.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const count = parseInt(arrayCount[index].value);

        if (count > 0) {
            arrayCount[index].value = count - 1;
        }
    })
})

arrayForms.forEach((form) => {
    form.addEventListener("submit", e => {
        e.preventDefault()

        const data = new FormData(form);

        const obj = {}

        data.forEach((value, key) => obj[key] = value)

        console.log(obj);

        fetch(`/api/cartsDB/${idCart}/product/${obj.id}`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(result => result.json())
            .then(json => {
                console.log(json)

                alert("Producto comprado")
            })
    })
});