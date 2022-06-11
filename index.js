import Cart from './Cart.js'
import Products from './Products.js'
let itemsToadd = localStorage.getItem("cartDemo") ? JSON.parse(localStorage.getItem('cartDemo')) : []
let products = []
//seteo una variable global para que una vez que se registro correctamente se 
//ejecute devuelta el checkout del carrito en caso de que el haya apretado antes el boton checkout y 
// no lo haya dejado realizar la compra por no estar registrado el email
//al principio siempre va a estar en false
let globalEjecutarCheckout = false
function setDark() {
    document.querySelector(".navbar").classList.remove("navbar-light")
    document.querySelector(".navbar").classList.remove("bg-light")
    document.querySelector(".navbar").classList.add("navbar-dark")
    document.querySelector(".navbar").classList.add("bg-dark")
    document.getElementById("mcart").style.color = "white"
    localStorage.setItem('darkMode', 'dark')
}
function setLight() {
    document.querySelector(".navbar").classList.remove("navbar-dark")
    document.querySelector(".navbar").classList.remove("bg-dark")
    document.querySelector(".navbar").classList.add("navbar-light")
    document.querySelector(".navbar").classList.add("bg-light")
    document.getElementById("mcart").style.color = "black"
    localStorage.setItem('darkMode', 'light')
}
function show(lproducts) {
    let hproducts = document.getElementById('Products');
    //console.log(lproducts)
    hproducts.innerHTML = `
        <h2>Products</h2>
      `
    hproducts.innerHTML += lproducts.map(product => `
    <div class="card border-info  p-2 col-3  " >
     <div class="card-header">${product.name}</div>
        <div class="card-body">
       
            <img  width=120px src="${product.img}" alt="product-image">
            <h1 class="card-title pricing-card-title">${product.price}$</h1>
            <button type="button" id="btnAdd${product.id}" class="btn btn-block btn-outline-primary"
               >Add to Cart</button>
        </div>
    </div>`
    ).join('')
    for (let product of lproducts) {
        //console.log(`btnAdd${product.id}`)
        document.getElementById(`btnAdd${product.id}`).addEventListener("click", () => { cart.addToCart({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 }) })
    }
    //this.cart.addToCart({id:${product.id},name:'${product.name}',price:${product.price},img:'${product.img}',qty:1})
}
// JavaScript code
function search_prod() {
    //window.alert("a")
    //loadProducts()//filtrar los productos por el boton search
    //filtro los productos por lo que esta puesto en el search
    //la idea es siempre traer los mismos 21 productos 
    //y solo filtrar lo que se muestra por eso no cambio nunca 
    //el listado de productos original
    if (document.getElementById('searchbar').value != '')
        show(products.filter((v) => v.name.toLowerCase().includes(document.getElementById('searchbar').value.toLowerCase())))
    else
        show(products)
}
function loadProducts() {
    const baseUrl = "https://dummyproducts-api.herokuapp.com";
    const mykey = "CrLqTfmXE_7t";
    products = []
    fetch(`${baseUrl}/api/v1/products?apikey=${mykey}&limit=21`)
        .then((response) => response.json())
        .then(({ data }) =>
            data.map((p) =>
                (new Products(p._id, p.product_name, p.product_image_lg, p.product_price, p.product_stock))
            )
        )
        .then((prod) => {
            //filtro los productos por lo que esta puesto en el search
            products = prod
            search_prod()
        }
        )
}
//en esta funcion asigno el precio que figura en la api de productos
//es por las dudas si el usuario me modifica el precio en la localstorage
function matchearCarritoStorage(prod, itemsCart) {
    for (const eC of itemsCart) {
        for (const eP of prod) {
            if (eP.id == eC.id) {
                eC.price = eP.price
                eC.name = eP.name
                eC.img = eP.img
            }
        }
    }
}
const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
//traigo los productos de una api y los filtro si hay algo en el input search
loadProducts()
//en esta funcion asigno los valores correctos si cambio el precio de los productos del carrito
//y elimino los productos del carrito que no se encuentran en los productos disponibles
matchearCarritoStorage(products, itemsToadd)
let cart = new Cart(itemsToadd)//set the initial items in the cart
//aplico cond ternario
let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem('darkMode') : ""
let emailUser = localStorage.getItem("emailUser") ? localStorage.getItem('emailUser') : ""
let flexSwitchCheckDefault = document.getElementById("flexSwitchCheckDefault")
if (validateEmail(emailUser)) {
    document.getElementById("btnRegister").innerHTML = emailUser
    document.getElementById("exampleInputEmail1").value = emailUser
}
else
    emailUser = ""
document.getElementById("btnOkEmail").addEventListener("click",
    (e) => {
        e.preventDefault()
        emailUser = document.getElementById("exampleInputEmail1").value
        if (validateEmail(emailUser)) {
            localStorage.setItem('emailUser', emailUser)
            document.getElementById("btnRegister").innerHTML = emailUser
            swal({
                title: "Email Register Succesfull!",
                text: "Welcome User Email " + emailUser,
                icon: "success",
                button: "Continue Shopping!",
            }).then(() => {
                //verifico si el antes habia apretado el boton checkout 
                //en ese caso vuelvo a ejecutar el checkout del carrito
                if (globalEjecutarCheckout == true)
                    document.getElementById("btnCheckout").click()
            }
            )
        } else
            swal({
                title: "Email Register Invalid!",
                text: "Please Register a valid Email",
                icon: "error",
                button: "Ok!",
            }).then(() => document.getElementById("btnRegister").click()
            )
    }
)
document.getElementById("btnCheckout").addEventListener("click",
    () => {
        emailUser = document.getElementById("exampleInputEmail1").value
        if (emailUser == '') {
            //si no ingreso el email lo envio a la pantalla de registrar email
            swal({
                title: "Cart Checkout ERROR!",
                text: "You should register with your email",
                icon: "error",
                button: "Ok!",
            }).then(() => {
                //seteo una variable global para que una vez que se registro correctamente se 
                //ejecute devuelta el checkout del carrito
                globalEjecutarCheckout = true
                document.getElementById("btnRegister").click()
            }
            )
        }
        else {
            globalEjecutarCheckout = false
            swal({
                title: "Cart Checkout Succesfull!",
                text: "You should contact by email " + emailUser + " to do the send of your products",
                icon: "success",
                button: "Ok!",
            })
                .then((value) => {
                    localStorage.setItem("cartDemo", "");
                    cart = new Cart()
                    document.getElementById("mcart").click()
                });
        }
    }
)
flexSwitchCheckDefault.addEventListener("change",
    () => flexSwitchCheckDefault.checked ? setDark() : setLight()
)
let searchbar = document.getElementById("searchbar")
searchbar.addEventListener("keyup", () => search_prod())
