// noty cdn
javascriptCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js')
cssCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.css');

// axios cdn
javascriptCdn('https://unpkg.com/axios/dist/axios.min.js');

// app url
// const app_url = process.env.APP_URL
const app_url = 'https://dev.myshopifyapp.com'
// wishlist button
var button = document.querySelector('.wishlist-button')
// button mode
const buttonMode = {
  ADD: '/api/add-to-wishlist',
  REMOVE: '/api/remove-from-wishlist',
  CHECK: '/api/check-wishlist'
}
// Product id
var product_id = button.dataset.product
// Customer id
var customer_id = button.dataset.customer
// Data to send to the Api
var data = {
  'shop_id': Shopify.shop,
  'product_id': product_id,
  'customer_id': customer_id
}


// Check if product exists in wishlist or not
//window.onload = setButtonToCorrectMode()


// call api. default mode = Add to wishlist
function callApi(mode = buttonMode.ADD){
  button.innerText = "Loading..."
    // api to be called
    let api = mode
    axios.post(app_url + api, data)
          .then(response => {
            if(mode  != buttonMode.CHECK ){
              // Switch the wishlist button to the correct mode
              mode === buttonMode.ADD ? buttonSwitch(buttonMode.REMOVE) : buttonSwitch()
              // fire response notification
              notification(response.data.type, response.data.message)
            }
            else{
              // check on script load: if product already in wishlist we switch to the "remove from wishlist" button
              response.data === true ? buttonSwitch(buttonMode.REMOVE) : buttonSwitch()
            }
          })
          .catch(error => {
            if(mode  != buttonMode.CHECK ){
              // fire error notification
              notification('error', 'Oops!!.. something is wrong.\n can\'t add product to wishlist :(')
            }
            // Reset button to add mode
            resetButton()
          });
} 

// wishlist function
function myFunction() {
  // Add product to wishlist
  if(button.classList.contains('active')){
    // Switch button to remove
    buttonSwitch(buttonMode.REMOVE)
    // Add to wishlist function
    callApi()
  }
  // Remove product from wishlist
  else{
    // Switch button to add
    buttonSwitch()
    // Remove from wishlist
    callApi(buttonMode.REMOVE)
  }

}

// set button to correct mode
function setButtonToCorrectMode(){
  // axios cdn
  javascriptCdn('https://unpkg.com/axios/dist/axios.min.js');
  callApi(buttonMode.CHECK)
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

// Switch button modes. default mode = add to wishlist
function buttonSwitch(btnMode = buttonMode.ADD){
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