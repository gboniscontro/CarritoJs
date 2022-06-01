import Cart from './Cart.js'

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
    hproducts.innerHTML = "<h2>Products</h2>"
    hproducts.innerHTML += lproducts.map(product => `
    <div class="col-4 card mb-4 " >
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
    let input = document.getElementById('searchbar').value
    input = input.toLowerCase();
    products = loadProducts()
    /*
        for (let i = 0; i < products.length; i++) {
            console.log(products[i].name.toLowerCase())
            console.log(input)
            if (!products[i].name.toLowerCase().includes(input)) {
                products.every
            }
            else {
    
            }
        }*/
    products = products.filter((v) => v.name.toLowerCase().includes(input))
    show(products)
}
function loadProducts() {

    return [{ id: 1, name: 'Termo 1 Mickey', price: 100, qty: 18, img: 'https://statics.avenida.com/avenida/products/photos/fd/2cd/87a03ef2cd1f65ccb57afd1da6618edc_l.jpg' }, { id: 24, name: 'Equipo 2 de mate Mickey', price: 300, qty: 12, img: 'https://statics.avenida.com/avenida/products/photos/4a/1d4/1e1f7f01d4411f5cd7874a4de6656c5f_l.jpg' },
    { id: 13, name: 'Termo 2 Mickey', price: 100, qty: 18, img: 'https://statics.avenida.com/avenida/products/photos/fd/2cd/87a03ef2cd1f65ccb57afd1da6618edc_l.jpg' }, { id: 21, name: 'Equipo 3 de mate Mickey', price: 300, qty: 12, img: 'https://statics.avenida.com/avenida/products/photos/4a/1d4/1e1f7f01d4411f5cd7874a4de6656c5f_l.jpg' },
    { id: 15, name: 'Termo 3 Mickey', price: 100, qty: 18, img: 'https://statics.avenida.com/avenida/products/photos/fd/2cd/87a03ef2cd1f65ccb57afd1da6618edc_l.jpg' }, { id: 23, name: 'Equipo 4 de mate Mickey', price: 300, qty: 12, img: 'https://statics.avenida.com/avenida/products/photos/4a/1d4/1e1f7f01d4411f5cd7874a4de6656c5f_l.jpg' },
    { id: 16, name: 'Termo 4 Mickey', price: 100, qty: 18, img: 'https://statics.avenida.com/avenida/products/photos/fd/2cd/87a03ef2cd1f65ccb57afd1da6618edc_l.jpg' }, { id: 25, name: 'Equipo 5 de mate Mickey', price: 300, qty: 12, img: 'https://statics.avenida.com/avenida/products/photos/4a/1d4/1e1f7f01d4411f5cd7874a4de6656c5f_l.jpg' }
        , { id: 17, name: 'Termo 5 Mickey', price: 100, qty: 18, img: 'https://statics.avenida.com/avenida/products/photos/fd/2cd/87a03ef2cd1f65ccb57afd1da6618edc_l.jpg' }, { id: 28, name: 'Equipo 6 de mate Mickey', price: 300, qty: 12, img: 'https://statics.avenida.com/avenida/products/photos/4a/1d4/1e1f7f01d4411f5cd7874a4de6656c5f_l.jpg' }]



}




//let itemsToadd = []
let itemsToadd = localStorage.getItem("cartDemo") ? JSON.parse(localStorage.getItem('cartDemo')) : []
let products = loadProducts()

let cart = new Cart(itemsToadd)//set the initial items in the cart
show(products)



//aplico cond ternario
let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem('darkMode') : ""
let flexSwitchCheckDefault = document.getElementById("flexSwitchCheckDefault")
//aplico cond ternario
flexSwitchCheckDefault.addEventListener("change",
    () => flexSwitchCheckDefault.checked ? setDark() : setLight()
)


let searchbar = document.getElementById("searchbar")

searchbar.addEventListener("keyup", () => search_prod())






/*

console.log("Simulador")
cart.arrItems.forEach((e) => console.log(e))
console.log("Agregar otro item que ya existe, tendria que sumarme la cantidad")
cart.addToCart({ id: 1, name: 'Item 1', price: 100, qty: 1 })
cart.arrItems.forEach((e) => console.log(e))
console.log("Agregar otro item que no existe")
cart.addToCart({ id: 3, name: 'Item 3', price: 130, qty: 1 })
cart.arrItems.forEach((e) => console.log(e))
console.log("sacar item 1")
cart.removeToCart(1)
cart.arrItems.forEach((e) => console.log(e))
console.log("sacar item 3")
cart.removeToCart(3)
cart.arrItems.forEach((e) => console.log(e))
*/









