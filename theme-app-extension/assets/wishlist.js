// noty cdn
javascriptCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js')
cssCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.css');


// app url
const app_url = 'https://dev.myshopifyapp.com'
const cookies_days = 365
// Regular expression to check if string is a valid UUID
const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
// wishlist button
var button = document.querySelector('.wishlist-button')
// button mode
const buttonMode = {
  ADD: '/api/add-to-wishlist',
  REMOVE: '/api/remove-from-wishlist',
  CHECK: '/api/check-wishlist',
  UPDATE_CUSTOMER_ID: '/api/update-customer-id-wishlist'
}
// Product id
var product_id = ''
// Product price
var product_price = 0
// Customer id
var customer_id = ''
// Data to send to the Api
var data = {}
var tmp_data = {}
var isCustomerIdUpdated = false
// Products ids
var products_ids = []

// initialize variables
initWishlistVariables()


// call api. default mode = Add to wishlist
function callApi(mode = buttonMode.ADD){
  button.innerText = "Loading..."
  if( mode === buttonMode.UPDATE_CUSTOMER_ID ) checkIfCustomerConnected()
  console.log('data', data)
  // api to be called
  let api = mode
  postData(app_url + api, data)
        .then(response => {
          if( mode  !== buttonMode.CHECK && mode !== buttonMode.UPDATE_CUSTOMER_ID ){
            // Switch the wishlist button to the correct mode
            mode === buttonMode.ADD ? 
                      ( buttonSwitch(buttonMode.REMOVE), setWishlistCookies(data.product_id) ) :
                      ( buttonSwitch(), setWishlistCookies(data.product_id, buttonMode.REMOVE) )
            // fire response notification
            notification(response.type, response.message)
          }
          else if( mode === buttonMode.CHECK){
            // check on script load: if product already in wishlist we switch to the "remove from wishlist" button
            response == true ? buttonSwitch(buttonMode.REMOVE) : buttonSwitch()
          }
          else{
            if(isCustomerIdUpdated){
              setCookie('ws_customer', data.shopify_customer_id, cookies_days)
              data = tmp_data
              tmp_data = {}
              isCustomerIdUpdated = false //reset the flag
            }
          }
        })
        .catch(error => {
          if(mode  === buttonMode.ADD ){
            // fire error notification
            notification('error', 'Oops!!.. something is wrong.\n can\'t add product to wishlist :(')
          }
          // Reset button to add mode
          resetButton()
        });
} 

// wishlist function
function myFunction() {
  // get correct variables before adding product to wishlist
  initWishlistVariables()
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

// POST method implementation using fetch:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

// Set cookie if customer is not authenticated
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Get cookie value
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
// Delete cookie
function deleteCookie(cname) {
  document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

// Check if cookie is set
function checkIfNotSetCookie(cname, default_cvalue) {
  let cvalue = getCookie(cname);
  return cvalue != "" ? cvalue : default_cvalue;
}

// Set app cookies
function setWishlistCookies(pr_id, mode = buttonMode.ADD){
  // set cookie for customer
  setCookie('ws_customer', data.customer_id, cookies_days)
  // set cookies for new added product
  setProductsIdsCookie(pr_id, mode)
}

function setProductsIdsCookie(pr_id, mode = buttonMode.ADD){
  // Get value of ws_products cookie
  let products_ids_cookie = getCookie('ws_products')
  // Check if it's not null or empty
  if(products_ids_cookie != "" && products_ids_cookie != null){
    // get the products ids into array
    products_ids = JSON.parse(products_ids_cookie)
  }
  // check the setProductsIdsCookie mode
  if(mode === buttonMode.ADD){
     // Push new product id into array (without duplicates)
    if(!products_ids.includes(pr_id)) products_ids.push(pr_id)
  }
  else{
      if(products_ids !== undefined || products_ids.length > 0){
        let tmp_products_ids = products_ids.filter((pid) => pid !== pr_id)
        products_ids = tmp_products_ids
      } 
  }
  // set the new cookie value for products
  setCookie('ws_products', JSON.stringify(products_ids))
}

function initWishlistVariables(){
  // Product id
  product_id = button.dataset.product
  // Product price
  product_price = button.dataset.product_price.replace(',', '')
  // Customer id
  customer_id = button.dataset.customer != "" ? button.dataset.customer : checkIfNotSetCookie('ws_customer',uuidv4())
  // Data to send to the Api
  data = {
    'shop_id': Shopify.shop,
    'product_id': product_id,
    'product_price': product_price,
    'customer_id': customer_id
  }

  callApi(buttonMode.UPDATE_CUSTOMER_ID)

  callApi(buttonMode.CHECK)
  
}

// Check if customer is connected and update db user id with customer's shopifyId
function checkIfCustomerConnected(){
    var c_uuid = getCookie('ws_customer') //get customer uuid from cookies
    if(c_uuid != "" && c_uuid != null && typeof c_uuid != undefined && regexExp.test(c_uuid) && button.dataset.customer != ""){
      tmp_data = data
      data.customer_id = c_uuid
      data.shopify_customer_id = button.dataset.customer
      isCustomerIdUpdated = true
    }
}


// create a unique id (will be used for customer)
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

