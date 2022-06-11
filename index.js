import Cart from './Cart.js'
import Products from './Products.js'
let products = []
let cart //se inicializara recien cuando se haya cargado los productos de la api
let itemsStorage = []
let itemsToaddCart = []

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
    document.querySelector('body').classList.add("darkMode")
    localStorage.setItem('darkMode', 'dark')
    flexSwitchCheckDefault.setAttribute("checked", "true");
}
function setLight() {
    document.querySelector(".navbar").classList.remove("navbar-dark")
    document.querySelector(".navbar").classList.remove("bg-dark")
    document.querySelector(".navbar").classList.add("navbar-light")
    document.querySelector(".navbar").classList.add("bg-light")
    document.getElementById("mcart").style.color = "black"
    document.querySelector('body').classList.remove("darkMode")
    localStorage.setItem('darkMode', 'light')
    flexSwitchCheckDefault.removeAttribute("checked")
}
function show(lproducts) {
    let hproducts = document.getElementById('Products');
    //console.log(lproducts)
    hproducts.innerHTML = `       
            <div class="container py-5 ">
                <div class="row  d-flex align-items-stretch">    
      `
    /*hproducts.innerHTML += lproducts.map(product => `
    <div class="card border-info  p-2 col-3  " >
     <div class="card-header">${product.name}</div>
        <div class="card-body">
       
            <div class="col-md-9 col-lg-9 col-xl-9">
             <img src="${product.img}" class="img-fluid rounded-3" >
             </div>
            <h1 class="card-title pricing-card-title">${product.price}$</h1>
            <h4 class="card-title stock-card-title">${product.qty}</h1>
            <button type="button" id="btnAdd${product.id}" class="btn btn-block btn-outline-primary"
               >Add to Cart</button>
        </div>
    </div>`
    ).join('')
*/
    hproducts.innerHTML += lproducts.map(product => `
        <div class="col-md-3 col-lg-3 mb-4 mb-md-0  d-flex align-items-stretch">
            <div class="card h-100">               
                <img src="${product.img}"
                    class="card-img-top "  />
                <div class="card-body">
                    

                    <div class="d-flex justify-content-between mb-3">
                        <h6 class="mb-0">${product.name}</h5>
                        <h6 class="text-dark mb-0">$${product.price}</h5>
                    </div>

                    <div class="d-flex justify-content-between mb-2">
                        <p class="text-muted mb-0">Available: <span class="fw-bold">${product.qty}</span></p>
                       
                       
                    </div> 
                    <div class="d-flex justify-content-between mb-2">
                    <button type="button" id="btnAdd${product.id}" class="btn btn-block btn-outline-primary">Add to Cart</button>
                    </div>
                </div>
            </div>
      </div>`
    ).join('') + `</div></div>`
    for (let product of lproducts) {
        //console.log(`btnAdd${product.id}`)
        document.getElementById(`btnAdd${product.id}`).addEventListener("click", () => { cart.addToCart({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 }) })
    }
    //this.cart.addToCart({id:${product.id},name:'${product.name}',price:${product.price},img:'${product.img}',qty:1})
}
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
async function loadProducts() {
    const baseUrl = "https://dummyproducts-api.herokuapp.com";
    const mykey = "CrLqTfmXE_7t";
    const apiurl = `${baseUrl}/api/v1/products?apikey=${mykey}`
    //const apiurl2 = 'https://dummyjson.com/products'
    products = []
    fetch(apiurl)
        .then((response) => response.json())
        .then(({ products }) =>
            products.map((p) =>
                (new Products(p._id, p.product_name, p.product_image_lg, p.product_price, p.product_stock))
            )
        )
        .then((prod) => {

            products = prod
            console.log('load products')
            //aca despues de que se cargo los productos voy a agarrar el carrito del storage y verificar que los precios 
            // y los items sean los correctos
            itemsStorage = localStorage.getItem("cartDemo") ? JSON.parse(localStorage.getItem('cartDemo')) : []
            matchearCarritoStorage(products, itemsStorage)
            //filtro los productos que se muestran por lo que esta puesto en el search pero en el global de productos siempre aparecen todos
            search_prod()

        }
        )
        .catch(() => {
            fetch("products.json")
                .then(response => response.json())
                .then(json => json)
                .then(({ data }) =>
                    data.map((p) =>
                        (new Products(p._id, p.product_name, p.product_image_lg, p.product_price, p.product_stock))
                    )
                )
                .then((prod) => {

                    products = prod
                    console.log('load products')
                    //aca despues de que se cargo los productos voy a agarrar el carrito del storage y verificar que los precios 
                    // y los items sean los correctos
                    itemsStorage = localStorage.getItem("cartDemo") ? JSON.parse(localStorage.getItem('cartDemo')) : []
                    matchearCarritoStorage(products, itemsStorage)
                    //filtro los productos que se muestran por lo que esta puesto en el search pero en el global de productos siempre aparecen todos
                    search_prod()

                }
                )
        }

        )
}
//en esta funcion asigno el precio que figura en la api de productos
//es por las dudas si el usuario me modifica el precio en la localstorage
//o no llegan a estar los mismos productos con el id que estaba guardado en el localstorage
function matchearCarritoStorage(prod, items) {
    console.log('matchear carritos');
    for (const { id: idC, qty } of items) {
        for (const { id, name, price, img } of prod) {
            if (id == idC) {

                itemsToaddCart.push({ id, name, price, qty, img })
            }
        }
    }
    cart = new Cart(itemsToaddCart)

}
//saco el stock de los productos que se compraron
function removerStockdeCarritoComprado(prod, items) {
    for (let { id: idC, qty } of items) {
        for (let p of prod) {
            if (p.id == idC) {
                p.qty = p.qty - qty
            }
        }
    }
    show(prod)
}

//devuelve true si no hay stock para el carrito elegido 
function nohayStockSuficiente(prod, items) {
    for (let { id: idC, qty } of items) {
        for (let p of prod) {
            if (p.id == idC && p.qty < qty) {
                return true
            }
        }
    }
    return false
}
const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
//traigo los productos de una api y los filtro si hay algo en el input search
await loadProducts()


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
        else
            if (nohayStockSuficiente(products, cart.arrItems)) {
                swal({
                    title: "Cart Checkout ERROR!",
                    text: "Stock no available, Please verify quantity of every products in the cart with the stocks available",
                    icon: "error",
                    button: "Ok!",
                }).then(() => {
                    //aca tendria que mostrar una advertencia en cada item del carrito q no tiene stock
                    //pero por ahora lo dejamos asi je
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
                        //borro todas las selecciones para empezar de cero para una proxima compra
                        //la unica que dejo es el email porque lo dejo siempre si ya se encuentra logueado
                        searchbar.value = ""
                        removerStockdeCarritoComprado(products, cart.arrItems)
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

if (darkMode == 'dark')
    setDark()
else
    setLight();
