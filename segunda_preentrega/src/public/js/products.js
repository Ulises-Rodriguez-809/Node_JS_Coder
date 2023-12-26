const cartId = document.getElementById("cartId");
const btnAñadir = document.querySelectorAll(".btn-añadir");

// HACER Q EL BTN APUNTE AL ENDPOINT Q HACE EL POST


for (let i = 0; i < btnAñadir.length; i++) {
    btnAñadir[i].addEventListener("click", async (e)=>{
        console.log(i,e);
        console.log(e.target.id);
    

        // console.log(result);
        
    })
}