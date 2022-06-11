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
        document.getElementById("mcart").innerHTML = "&nbsp;" + totalItems
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
        /*  hcart.innerHTML = items.map((item) => `
          <div class="card border-success mb-3" style="max-width: 20rem;">
              <div class="card-header">${item.name}</div>
              <div class="card-body">
              <p>
                     <img  width=30px src="${item.img}" alt="product-image">
                  $${item.price}
                      <button class= "btn btn-outline-secondary" id="btnplus${item.id}"><i class="fas fa-plus"></i></button>
                      ${item.qty}&nbsp;&nbsp;<button class= "btn btn-outline-secondary"   id="btnmin${item.id}" ><i class="fas fa-minus"></i></button>
                 </p>
              <span class="card-text">$${new Intl.NumberFormat("de-DE").format(item.price * item.qty)}</span> 
              
                 <div class="row">
                    <button class= "btn btn-danger" id="btndel${item.id}"><i class="fas fa-trash-alt"></i></button>
                  </div>
             </div> 
          </div>
                 `).join("")
                 */
        hcart.innerHTML = items.map((item) => `
            <div class="card rounded-3 mb-4" >
                <div class="card-body p-4">
                    <div class="row d-flex justify-content-between align-items-center">
                        <div class="col-md-2 col-lg-2 col-xl-2">
                            <img src="${item.img}"
                                class="img-fluid rounded-3" >
                        </div>
                        <div class="col-md-3 col-lg-3 col-xl-3">
                            <p class="lead fw-normal mb-2">${item.name} </p>
                            
                        </div>
                        <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                            <button class="btn btn-link px-2"  id="btnmin${item.id}"
                                onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input id="form1" min="0" name="quantity" value="${item.qty}" type="number"
                                class="form-control form-control-sm" style="width:50px" />
                            <button class="btn btn-link px-2" id="btnplus${item.id}"
                                onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                            <h5 class="mb-0">$${new Intl.NumberFormat("de-DE").format(item.price * item.qty)}</h5>
                        </div>
                        <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                            <a href="#!" class="text-danger"  id="btndel${item.id}"><i class="fas fa-trash fa-lg"></i></a>
                        </div>
                    </div>
                </div>
                        </div >`).join("")
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
        let totalItems = this.arrItems.reduce((prev, { qty }) => prev + qty, 0)
        document.getElementById("mcart").innerHTML = "&nbsp;" + totalItems
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