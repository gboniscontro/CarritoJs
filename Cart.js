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

        const hcart = document.querySelector(".cart")


        hcart.innerHTML = items.map((item) => `
                <tr>
                    <td>#${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td style="width: 60px;">	
                        <button type="button" class="btn btn-block btn-sm btn-outline-primary"
                        id="btnplus${item.id}"  >+</button>
                    </td>
                    <td style="width: 60px;">
                        <button type="button" class="btn btn-block btn-sm btn-outline-primary"
                        id="btnmin${item.id}"   >-</button>
                    </td>
                    <td class="text-right">$${item.price}</td>
                    <td class="text-right"><Button id="btndel${item.id}" class="btn btn-primary" >Delete</Button></td>
                </tr>`).join("")
        items.forEach(element => {
            total += element.price * element.qty
            arrNum.push(this.costoPorItemN(element)) //desestructurar
            document.getElementById(`btndel${element.id}`).onclick = () => { this.deleteToCart(element.id) }
            document.getElementById(`btnplus${element.id}`).onclick = () => { this.quantity(element.id, 1) }
            document.getElementById(`btnmin${element.id}`).onclick = () => { this.quantity(element.id, -1) }

        });
        console.log(total)
        document.querySelector(".total").innerHTML = `$${total}`
        console.log("calcularTotal", this.calcularTotal(arrNum))
        console.log('Precio Maximo', Math.max(...arrNum))
        localStorage.setItem("cartDemo", JSON.stringify(items))
    }
    costoPorItem({ price, qty }) {//desestructurar un objeto
        return price * qty
    }
    costoPorItemN({ price: precio, qty: cantidad }) {//desestructurar con otro nombre un objeto
        console.log('Cantidad', cantidad, 'Precio', precio)
        return cantidad * precio
    }
    calcularTotal(...numeros) {
        //console.log(numeros)
        //hay que llamarlo con el [0] para que ejecute el reduce con numeros enteros si no lo concatena como string
        return numeros[0].reduce((prev, sig) => prev + sig, 0)

    }


}