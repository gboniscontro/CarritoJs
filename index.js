
let arrCart =[];
function isItemInCart(currId){
    blnFind = false
    arrCart.forEach((value)=> {
            if (value.id == currId) {
                value.qty++
               // console.log('se encontro' + value.id)
                blnFind= true
            } 
        })
  
    return blnFind
}

function addToCart(e){

    const currId = e.id;
    let item = [];

    
    if(!isItemInCart(currId)){

                item['name'] = e.name;
                item['price'] = e.price ;             
                item['id'] = e.id;
                item['qty'] = 1;
                arrCart.push(item);
    
    }
    renderCart(arrCart)
    
}

function renderCart(items) {

    const $cart = document.querySelector(".cart")

    const $total = document.querySelector(".total")

    $cart.innerHTML = items.map((item) => `
            <tr>
                <td>#${item.id}</td>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td style="width: 60px;">	
                    <button type="button" class="btn btn-block btn-sm btn-outline-primary"
                        onClick="arrCart.quantity(${item.id},1)">+</button>
                </td>
                <td style="width: 60px;">	
                    <button type="button" class="btn btn-block btn-sm btn-outline-primary"
                        onClick="arrCart.quantity(${item.id},-1)">-</button>
                </td>
                <td class="text-right">$${item.price}</td>
                <td class="text-right"><Button class="btn btn-primary" onClick="arrCart.remove(${item.id})">Delete</Button></td>
            </tr>`).join("")


}

