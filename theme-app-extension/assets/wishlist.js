// APIs Enum
const API = {
    ADD: '/api/add-to-wishlist',
    REMOVE: '/api/remove-from-wishlist',
    CHECK: '/api/check-wishlist',
    UPDATE_CUSTOMER_ID: '/api/update-customer-id-wishlist'
}
// APP URL
const APP_URL = 'https://dev.myshopifyapp.com'
const cookies_days = 365

// Class To manage Wishlist states
class WishlistManager {
    constructor(wishlist_button_selector) {
        // select the wishlist button
        this.button = document.querySelector('.'+wishlist_button_selector)
        this.cookiesManager = new CookiesManager()
        // Product id
        this.product_id = this.button.dataset.product
        // Product price
        this.product_price = this.button.dataset.product_price.replace(',', '')
        // Customer id
        this.customer_id = this.button.dataset.customer != "" ? this.button.dataset.customer : this.cookiesManager.checkIfNotSetCookie('ws_customer',this.uuidv4())
        // Data to send to the Api
        this.data = {
            'shop_id': Shopify.shop,
            'product_id': this.product_id,
            'product_price': this.product_price,
            'customer_id': this.customer_id
        }
        console.log('data', this.data)
        this.states = [new AddToWishlist(this.button), new RemoveFromWishlist(this.button), new CheckWishlist(this.button), new UpdateCustomerIdWishlist(this.button)];
        this.current = this.states[3];
        this.current.buttonSwitch();
    }
  
    change() {
      const totalStates = this.states.length;
      console.log("this.current",this.current);
      let currentIndex = this.states.findIndex(light => light === this.current);
      if (currentIndex + 1 < totalStates) this.current = this.states[currentIndex + 1];
      else this.current = this.states[0];
    }

    // Call the correct api
    callApi() {
      return this.current.callApi();
    }
    // switchButton
    buttonSwitch() {
        return this.current.buttonSwitch();
    }
    
    // create a unique id (will be used for customer)
    uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    
}
// Super abstract class for wishlist apis
class WishlistApi {
    
    constructor(api, button, data) {
        if(this.constructor == WishlistApi) throw new Error(" Object of Abstract Class cannot be created");
            
        this.end_point = APP_URL+api
        this.button = button
        this.cookiesManager = new CookiesManager()
        this.fetchApi = new FetchApi()
        this.data = data
    }

    // These methods should be implemented (override)
    callApi(){
        throw new Error('You have to implement the method callApi');
    }
    buttonSwitch(){
        throw new Error('You have to implement the method buttonSwitch');
    }
    postData(data = {}) {
        // Default options are marked with *
        const response = await fetch(this.end_point, {
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
}

class AddToWishlist extends WishlistApi {
    constructor(button, data) {
        super(API.ADD, button, data);
    }


    buttonSwitch(){
        this.button.classList.add('active');
        this.button.innerText = "Add To Wishlist";
        return "Add To Wishlist ";
    }

    setProductsIdsCookie(pr_id){
        let products_ids_cookie = this.cookiesManager.getCookie('ws_products')
        // Check if it's not null or empty
        if(products_ids_cookie != "" && products_ids_cookie != null){
            // get the products ids into array
            products_ids = JSON.parse(products_ids_cookie)
        }
        // Push new product id into array (without duplicates)
        if(!products_ids.includes(pr_id)) products_ids.push(pr_id)
        // set the new cookie value for products
        setCookie('ws_products', JSON.stringify(products_ids))
    }

    callApi(){
        super.postData(this.data).then(response => {
              // Switch the wishlist button to the correct mode
             buttonSwitch(buttonMode.REMOVE), setWishlistCookies(data.product_id)
              // fire response notification
              notification(response.type, response.message)
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
}

class RemoveFromWishlist extends WishlistApi {
    constructor(button) {
        super(API.REMOVE, button);
    }

    callApi() {
        return this.end_point;
    }

    buttonSwitch(){
        this.button.classList.remove('active');
        this.button.innerText = "Remove from Wishlist";
        return "Remove from Wishlist";
    }

    setProductsIdsCookie(pr_id){
        let products_ids_cookie = this.cookiesManager.getCookie('ws_products')
        // Check if it's not null or empty
        if(products_ids_cookie != "" && products_ids_cookie != null){
            // get the products ids into array
            products_ids = JSON.parse(products_ids_cookie)
        }
        if(products_ids !== undefined || products_ids.length > 0){
            let tmp_products_ids = products_ids.filter((pid) => pid !== pr_id)
            products_ids = tmp_products_ids
        } 
        // set the new cookie value for products
        setCookie('ws_products', JSON.stringify(products_ids))
    }
}

class CheckWishlist extends WishlistApi {
    constructor(button) {
        super(API.CHECK, button);
    }

    callApi() {
        return this.end_point;
    }

    buttonSwitch(){
        this.button.classList.add('active');
        this.button.innerText = "Add To Wishlist";
        return "Add To Wishlist";
    }
}

class  UpdateCustomerIdWishlist extends WishlistApi {
    constructor(button) {
        super(API.UPDATE_CUSTOMER_ID, button);
    }

    callApi() {
        return this.end_point;
    }

    buttonSwitch(){
        this.button.classList.add('active');
        this.button.innerText = "Add To Wishlist";
        return "Add To Wishlist";
    }
}

class CookiesManager {
    // Check if cookie is set
    checkIfNotSetCookie(cname, default_cvalue) {
        let cvalue = this.getCookie(cname);
        return cvalue != "" ? cvalue : default_cvalue;
    }
    // Get cookie value
    getCookie(cname) {
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
    // Set cookie if customer is not authenticated
    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    // Delete cookie
    deleteCookie(cname) {
        document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
}


function myFunction() {
    alert('kabbbom')
}

// usage
const wishlistManager = new WishlistManager('wishlist-button');


wishlistManager.change();

console.log(wishlistManager.buttonSwitch()); 

wishlistManager.change();

console.log(wishlistManager.buttonSwitch()); 

wishlistManager.change();

console.log(wishlistManager.buttonSwitch()); 

wishlistManager.change();

console.log(wishlistManager.buttonSwitch()); 