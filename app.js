const cartbtn = document.querySelector('.cart-btn');
const closecart = document.querySelector('.close-cart')
const clearcart = document.querySelector('.clear-cart')
const cartDom = document.querySelector('.cart')
const cartoverlay = document.querySelector('.cart-overlay')
const cartitems = document.querySelector('.cart-items')
const carttotal = document.querySelector('.cart-total')
const cartcontent = document.querySelector('.cart-content')
const productDom = document.querySelector('.products-center')
const icon = document.getElementById('nav-icon')

icon.addEventListener('click', ()=> {
  cartoverlay.classList.add('transparent')
  cartDom.classList.add('showCart')
})
closecart.addEventListener('click', ()=> {
  cartoverlay.classList.remove('transparent')
  cartDom.classList.remove('showCart')
})
let cart = []
let buttonDom = []

class Products {
  async getProducts(){
    try {
     let result = await fetch("ocean.json")
     let data = await result.json()
    let products = data.items
     products = products.map(item =>{
      const {title, price} = item.fields
      const {id} = item.sys
      const image = item.fields.image.fields.file.url
      return {title,price,id,image}
     })
     return products
    } catch (error){

    }
 }
 
}

class UI  {
  displayProducts(products) {
    let result = "";
    products.forEach(product => {
        result += ` 
        <article class="Product">
        <div class="img-container">
            <img src="${product.image}" alt="" class="product-img">
            <button class="bag-btn" data-id="${product.id}">
                <i class="fas fa-shopping-cart"></i>
                add to bag
            </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
    </article>
        `
    });
    productDom.innerHTML = result;
    }

    getBagButtons(){
      const btns = [...document.querySelectorAll('.bag-btn')]
      buttonDom = btns
      btns.forEach(btn => {
        let id = btn.dataset.id
        let incart = cart.find(item => item.id === id)
        if(incart) {
          btn.innerText = "In Cart"
          btn.disabled = true
        }

        btn.addEventListener('click', (event) => {
          event.target.innerText = "In Cart"
          event.target.disabled = true
          let cartItem = {...Storage.getProducts(id),amount:1}
          cart = [...cart, cartItem]
          this.setCartValues(cart)
          this.additems(cartItem)
        })
      })
    }
    setCartValues(cart){
     let tempTotal = 0
     let itemsTotal = 0
      cart.map(item => {
        tempTotal += item.price * item.amount
        itemsTotal += item.amount
      })
      carttotal.innerText = parseFloat(tempTotal.toFixed(2))
      cartitems.innerText = itemsTotal
    }
  additems(ocean) {
    const div = document.createElement('div')
    div.classList.add('cart-item')
    div.innerHTML = `
    <div class="cart-item">
    <img src="${ocean.image}" alt="">
<div class="">
    <h4>${ocean.title}</h4>
    <h5>$${ocean.price}</h5>
    <span class="remove-item"></span>
</div>
</div>
    `
    cartcontent.appendChild (div)
  }
  cartClear () {
    clearcart.addEventListener('click', ()=>{
        this.clearcart();
    })
    cartcontent.addEventListener('click', (event) => {
      if(event.target.classList.contains('remove-item')){
        let removeitem = event.target
       let id = removeitem.dataset.id
       cartcontent.removeChild(removeitem.parentElement.previousSibiling)
       this.removeitem(id)
      }
    })
 }
 clearcart(){
   let cartitem = cart.map(item => item.id)
   cartitem.forEach(id => this.removeitem(id));
   while(cartcontent.children.length > 0) {
    cartcontent.removeChild(cartcontent.children[0])
   }
 }
 removeitem(id){
    cart = cart.filter(item => item.id !==id)
    this.setCartValues(cart)
    Storage.saveCart(cart)
    let btn = this.getSingleButton(id);
    btn.disabled = false;
    btn.innerHTML = `<i class= "fas fa-shopping-cart"></i>add to cart`
 }
 getSingleButton(id){
  return buttonDom.find(btn => btn.dataset.id === id)
}
}
class Storage {
static saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products))
}
static getProducts(id){
  let products = JSON.parse(localStorage.getItem('products'))
  return products.find(product => product.id === id)
}
static saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart))
}
}
document.addEventListener("DOMContentLoaded", ()=> {
  const ui = new UI()
  const products = new Products();
  products.getProducts().then(products =>{
    ui.displayProducts(products)
    Storage.saveProducts(products)
  }).then(()=>{
  ui.getBagButtons()
  ui.cartClear()
})
})
