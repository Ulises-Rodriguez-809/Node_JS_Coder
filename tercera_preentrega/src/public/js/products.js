const idCart = document.getElementById("id-cart").textContent;

const arrayForms = document.querySelectorAll(".form");


// ACA CAPAZ PODES OBTENER EL ID DEL CARRITO DEL TOKEN

arrayForms.forEach((form) => {
    form.addEventListener("submit",e=>{
        e.preventDefault()

        const data = new FormData(form);

        const obj = {}

        data.forEach((value,key)=> obj[key] = value)

        fetch(`/api/cartsDB/${idCart}/product/${obj.id}`,{
            method : "POST",
            body : JSON.stringify(obj),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then(result => result.json())
        .then(json => {
            console.log(json)
            
            alert("Producto comprado")
        })
    })
});