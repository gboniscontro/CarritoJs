export default class Cart {
    constructor(arrItems = [])//default items of cart is empty
    {
        this.arrItems = arrItems
        this.renderCart(this.arrItems)
    }
    isItemInCart(currId) {
        return this.arrItems.some((value) => value.id == currId)
    }
    //aplico operador nullish 
    removeToCart(currId) {
        let index = 0
        if ((index = this.arrItems.findIndex((value) => value.id == currId)) > -1) {
            //aplico operador nullish y operador and
            (this.arrItems[index].qty ?? this.arrItems[index].qty-- == 0) && this.arrItems.splice(index, 1)
        }
        this.renderCart(this.arrItems)
    }
    deleteToCart(currId) {
        let index = 0
        if ((index = this.arrItems.findIndex((value) => value.id == currId)) > -1) {
            if (this.arrItems[index].qty != undefined) {
                this.arrItems.splice(index, 1)
            }
        }
        this.renderCart(this.arrItems)
    }
    addToCart(e) {
        const currId = e.id;
        let item = [];
        //debugger;
        if (!this.isItemInCart(currId)) {
            this.arrItems.push(e);
        }
        else {
            item = this.arrItems.find((value) => value.id == currId)
            item.qty++
        }
        this.renderCart(this.arrItems)
        // para entender el reduce el previosvalue es el que queda del return, y el current es el objeto
        //lo siguiente lo reduje en una linea solo desestructurando el objeto por la cantidad qty
        /*
        let totalItems = this.arrItems.reduce((prev, cur) => {
            console.log("P", prev, "C", cur)
            return prev + (cur.qty ?? 0)
        }, 0)
*/
        let totalItems = this.arrItems.reduce((prev, { qty }) => prev + qty, 0)
        swal({
            title: "Cart Product Added!",
            text: totalItems + " item(s) added to cart",
            icon: "success",
            buttons: {
                cancel: "Continue Shopping!",
                view: "View Cart!"
            },
        })
            .then((value) => {
                switch (value) {
                    case "cancel":
                        break;
                    case "view":
                        document.getElementById("mcart").click()
                        break;
                }
            });
    }
    quantity(currId, num) {
        let item = this.arrItems.find((value) => value.id == currId)
        if (item.qty > 0)
            item.qty += num
        else
            item.qty = num
        if (item.qty == 0) {
            let index = this.arrItems.findIndex((value) => value.id == currId)
            this.arrItems.splice(index, 1)
        }
        this.renderCart(this.arrItems)
    }
    renderCart(items) {
        let total = 0;
        let arrNum = []
        //console.log(products)
        const hcart = document.querySelector(".cart")
        hcart.innerHTML = items.map((item) => `
        <div class="card border-success mb-3" style="max-width: 20rem;">
            <div class="card-header">${item.name}</div>
            <div class="card-body"><p>
                   <img  width=30px src="${item.img}" alt="product-image">
                $${item.price}
                    <button class= "btn btn-outline-secondary" id="btnplus${item.id}"><i class="fas fa-plus"></i></button>
                    ${item.qty}&nbsp;&nbsp;<button class= "btn btn-outline-secondary"   id="btnmin${item.id}" ><i class="fas fa-minus"></i></button>
               </p>
               
               <div class="row">
                <p class="card-text">$${new Intl.NumberFormat("de-DE").format(item.price * item.qty)}</p> 
                <button class= "btn btn-danger" id="btndel${item.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
           </div> 
        </div>
               `).join("")
        items.forEach(element => {
            total += element.price * element.qty
            arrNum.push(this.costoPorItemN(element)) //desestructurar
            document.getElementById(`btndel${element.id}`).onclick = () => { this.deleteToCart(element.id) }
            document.getElementById(`btnplus${element.id}`).onclick = () => { this.quantity(element.id, 1) }
            document.getElementById(`btnmin${element.id}`).onclick = () => { this.quantity(element.id, -1) }
        });
        //  console.log(total)
        document.querySelector(".total").innerHTML = `$${new Intl.NumberFormat("de-DE").format(total)}`
        //  console.log("calcularTotal", this.calcularTotal(arrNum))
        // console.log('Precio Maximo', Math.max(...arrNum))
        localStorage.setItem("cartDemo", JSON.stringify(items))
        if (total > 0) {
            document.getElementById("btnCheckout").removeAttribute("disabled");
        }
        else {
            document.getElementById("btnCheckout").setAttribute("disabled", "true");
        }
    }
    costoPorItem({ price, qty }) {//desestructurar un objeto
        return price * qty
    }
    costoPorItemN({ price: precio, qty: cantidad }) {//desestructurar con otro nombre un objeto
        //  console.log('Cantidad', cantidad, 'Precio', precio)
        return cantidad * precio
    }
    calcularTotal(...numeros) {
        //console.log(numeros)
        //hay que llamarlo con el [0] para que ejecute el reduce con numeros enteros si no lo concatena como string
        return numeros[0].reduce((prev, sig) => prev + sig, 0)
    }
}