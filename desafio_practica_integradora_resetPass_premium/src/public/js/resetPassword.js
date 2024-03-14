const form = document.getElementById("resetPassForm");

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const data = new FormData(form);

    const obj = {}

    data.forEach((value,key) => obj[key] = value);

    fetch("/api/sessions/resetPassword",{
        method : "POST",
        body : JSON.stringify(obj),
        headers : {
            "Content-Type" : "application/json"
        }
    })
    .then(result => result.json())
    .then(json => {
        console.log(json);
        if (json.status === "success") {
            alert("Contraseña cambiada con exito");
        } else {
            alert(`${json.payload}`);
        }
    })
})