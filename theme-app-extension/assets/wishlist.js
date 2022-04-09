// noty cdn
javascriptCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js')
cssCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.css');

// axios cdn
javascriptCdn('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js');

// app url
// const app_url = process.env.APP_URL
const app_url = 'https://dev.myshopifyapp.com'
// wishlist button
const button = document.querySelector('.wishlist-button')
const buttonMode = {
  ADD: 'addToWishList',
  REMOVE: 'removeFromWishList'
}

// add product to customer's wishlist
function addToWishlist(product_id, customer_id){
  button.innerText = "Loading..."
    let data = {
      'shop_id': Shopify.shop,
      'product_id': product_id,
      'customer_id': customer_id
    }
    axios.post(app_url+'/api/add-to-wishlist', data)
          .then(response => {
            console.log("Response", response)
            button.innerText = "Remove From Wishlist"
            notification(response.data.type, response.data.message)
          })
          .catch(error => {
            button.innerText = "Remove From Wishlist"
            notification('error', 'Oops!!.. something is wrong.\n can\'t add product to wishlist :(')
            // Reset button to add mode
            resetButton()
          });
} 

// wishlist function
function myFunction() {
  // Get product id
  const product_id = button.dataset.product
  // Get customer id
  const customer_id = button.dataset.customer

  // Add product to wishlist
  if(button.classList.contains('active')){
    // Switch button to remove
    ButtonSwitchToAddToWishlist(buttonMode.REMOVE)
    // add to wishlist function
    addToWishlist(product_id, customer_id)
  }
  // remove product from wishlist
  else{
    // Switch button to add
    ButtonSwitchToAddToWishlist()
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

// Switch button modes
function ButtonSwitchToAddToWishlist(btnMode = buttonMode.ADD){
  if(btnMode === buttonMode.ADD){
    button.classList.add('active');
    button.innerText = "Add To Wishlist";
  }
  else{
    button.classList.remove('active')
    button.innerText = "Remove From Wishlist";
  }

}

// Reset button to default
function resetButton(){
  button.classList.remove('active')
  button.classList.add('active');
  button.innerText = "Add To Wishlist";
}