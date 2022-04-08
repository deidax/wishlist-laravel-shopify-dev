// const { default: axios } = require("axios");
// noty cdn
javascriptCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js')
cssCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.css');

// axios cdn
javascriptCdn('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js');

// app url
// const app_url = process.env.APP_URL
const app_url = 'https://dev.myshopifyapp.com'

// add product to customer's wishlist
function addToWishlist(product_id, customer_id){
    let data = {
      'shop_id': Shopify.shop,
      'product_id': product_id,
      'customer_id': customer_id
    }
    axios.post(app_url+'/api/add-to-wishlist', data)
          .then(response => {
            console.log("Response", response)
          })
          .catch(error => {
            console.log("Error", error)
          });
} 

// wishlist function
function myFunction() {
  const button = document.querySelector('.wishlist-button')
  // Get product id
  const product_id = button.dataset.product
  // Get customer id
  const customer_id = button.dataset.customer

  // Add product to wishlist
  if(button.classList.contains('active')){
    button.classList.remove('active')
    button.innerText = "Remove From Wishlist";
    // add to wishlist function
    addToWishlist(product_id, customer_id)
    notification('success', "Product ("+product_id+") added to wishlist")
  }
  // remove product from wishlist
  else{
    button.classList.add('active')
    button.innerText = "Add To Wishlist";
    notification('warning', 'Product removed from wishlist')
  }

}

// notify user
function notification(type, text){
  new Noty({
    type: type,
    layout: 'topRight',
    text: text,
    timeout: 3000
}).show();
}

// add javascript cdn

function javascriptCdn(cdn){
  let script = document.createElement('script');
  script.type = 'text/javascript';
  
  script.src = cdn;
  document.body.appendChild(script);
}

// add css cdn
function cssCdn(cdn){
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  
  link.href = cdn;
  document.body.appendChild(link);
}