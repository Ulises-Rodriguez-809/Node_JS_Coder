const form = document.getElementById("registerForm");

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const data = new FormData(form);

    const obj = {};

    data.forEach((value,key)=>obj[key] = value);

    console.log(obj);

    fetch('/api/sessions/register',{
        method : "POST",
        body : JSON.stringify(obj),
        headers : {
            "Content-Type" : "application/json"
        }
    })
    .then(result => result.json())
    .then(json => console.log(json)) //aca capaz hacer redirec como en login
    // .then(window.location.replace('/api/productsDB')) //esto aca podrias poner un alert o algo asi cosa q no sea tan brusco el cambio
})