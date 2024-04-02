const idCart = document.getElementById("id-cart").textContent;

const arrayForms = document.querySelectorAll(".form");

const arrayBtnsPlus = document.querySelectorAll(".plus");
const arrayBtnsMinus = document.querySelectorAll(".minus");
const arrayCount = document.querySelectorAll(".count");

const finalizarCompra = document.querySelector(".finalizarCompra");

const userName = document.getElementById("userName").textContent;
const userRol = document.getElementById("userRol").textContent;

const checkRol = () => {
    const containerChangeRol = document.getElementById("containerChangeRol");

    if (userRol === "user") {
        const btn = document.createElement("button");

        btn.textContent = "Obtener premium";

        btn.setAttribute("class", "opcionLink");
        btn.setAttribute("id", "btnChangeRol");

        containerChangeRol.append(btn);

        const btnChangeRol = document.getElementById("btnChangeRol");

        btnChangeRol.addEventListener("click", () => {
            const endpoint = "/api/sessions/premiumUser";

            fetch(endpoint, {
                method: "POST",
                body: JSON.stringify({ rol: "premium" }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(result => result.json())
                .then(json => {
                    console.log(json);
                    if (json.status === "error") {
                        alert("No se logro obtener el rol premium, contacte con el servicio al cliente");
                    }
                    else {
                        alert(`Felicidades ${userName} por obtener rol premium, ahora podras crear, actualizar y eliminar tus propios products, PARA VER LOS CAMBIOS VUELVA A INICAR SESSION`);

                        location.replace("http://localhost:8080/");
                    }
                })
        })
    }
}

finalizarCompra.addEventListener("click", () => {
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

checkRol();