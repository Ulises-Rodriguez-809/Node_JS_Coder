const idCart = document.getElementById("id-cart").textContent;

const arrayForms = document.querySelectorAll(".form");

arrayForms.forEach((form) => {
    form.addEventListener("submit",e=>{
        e.preventDefault()

        const data = new FormData(form);

        const obj = {}

        data.forEach((value,key)=> obj[key] = value)

        // console.log(obj);

        // console.log(idCart);
        // console.log(idCart === idCart.trim());

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