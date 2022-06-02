import Cart from './Cart.js'
import Products from './Products.js'
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
    for (let product of products) {
        //console.log(`btnAdd${product.id}`)
        document.getElementById(`btnAdd${product.id}`).addEventListener("click", () => { cart.addToCart({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 }) })
    }
    //this.cart.addToCart({id:${product.id},name:'${product.name}',price:${product.price},img:'${product.img}',qty:1})
}
// JavaScript code
function search_prod() {
    //window.alert("a")
    loadProducts()//filtrar los productos por el boton search
}
function loadProducts() {
    const baseUrl = "https://dummyproducts-api.herokuapp.com";
    const mykey = "CrLqTfmXE_7t";
    products = []
    fetch(`${baseUrl}/api/v1/products?apikey=${mykey}&limit=50`)
        .then((response) => response.json())
        .then(({ data }) =>
            data.map((p) =>
                (new Products(p._id, p.product_name, p.product_image_lg, p.product_price, p.product_stock))
            )
        )
        .then((prod) => {
            //filtro los productos por lo que esta puesto en el search
            products = prod.filter((v) => v.name.toLowerCase().includes(document.getElementById('searchbar').value.toLowerCase()))
            show(products)
        }
        )
    //  .then(({ id: _id, product_price: price }) => console.log(price))
}
//let itemsToadd = []
let itemsToadd = localStorage.getItem("cartDemo") ? JSON.parse(localStorage.getItem('cartDemo')) : []
let products = []
loadProducts()
let cart = new Cart(itemsToadd)//set the initial items in the cart
//aplico cond ternario
let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem('darkMode') : ""
let flexSwitchCheckDefault = document.getElementById("flexSwitchCheckDefault")
let emailUser = localStorage.getItem("emailUser") ? localStorage.getItem('emailUser') : ""
//aplico cond ternario
document.getElementById("lblUser").innerHTML = "Welcome User Email " + emailUser
document.getElementById("exampleInputEmail1").value = emailUser
document.getElementById("btnRegEmail").addEventListener("click",
    () => {
        emailUser = document.getElementById("exampleInputEmail1").value
        localStorage.setItem('emailUser', emailUser)
        document.getElementById("lblUser").innerHTML = "Welcome User Email " + emailUser
        //window.alert(document.getElementById("lblUser").innerHTML)
        if (emailUser != "")
            swal({
                title: "Email Register Succesfull!",
                text: "Welcome User Email " + emailUser,
                icon: "success",
                button: "Continue Shopping!",
            })
        else
            swal({
                title: "Email Register Deleted!",
                text: "Please Register your Email",
                icon: "error",
                button: "Ok!",
            })
    }
)
document.getElementById("btnCheckout").addEventListener("click",
    () => {
        emailUser = document.getElementById("exampleInputEmail1").value
        localStorage.setItem('emailUser', emailUser)
        document.getElementById("lblUser").innerHTML = "Welcome User Email " + emailUser
        if (emailUser == '') {
            swal({
                title: "Cart Checkout ERROR!",
                text: "You should register with your email",
                icon: "error",
                button: "Ok!",
            }).then(() => {
                document.getElementById("btnRegistrar").click()
            }
            )
        }
        else {
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
