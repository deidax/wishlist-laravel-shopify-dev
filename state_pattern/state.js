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
            'shop_id': 'Shopify.shop',
            'product_id': this.product_id,
            'product_price': this.product_price,
            'customer_id': this.customer_id
        }
        console.log('data', this.data)
        this.states = [new AddToWishlist(this.button, this.data), new RemoveFromWishlist(this.button, this.data), new CheckWishlist(this.button), new UpdateCustomerIdWishlist(this.button)];
        this.current = this.states[3];
        this.current.buttonSwitch();
    }

    isWishlistButtonActive()
    {
        return this.button.classList.contains('active')
    }
  
    change() {
      const totalStates = this.states.length;
      console.log("this.current",this.current);
      let currentIndex = this.states.findIndex(light => light === this.current);
      if (currentIndex + 1 < totalStates) this.current = this.states[currentIndex + 1];
      else this.current = this.states[0];
    }

    addToWishlist()
    {
        let state = this.states[0];
        return state
    }

    removeFromWishlist()
    {
        let state = this.states[1];
        return state
    }

    checkWishlist()
    {
        return this.states[2];
    }

    UpdateCustomerIdWishlist()
    {
        return this.states[3];
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

    // add js cdn
    javascriptCdn(cdn){
        let script = document.createElement('script');
        script.type = 'text/javascript';
        
        script.src = cdn;
        document.body.appendChild(script);
    }
      
    // add css cdn
    cssCdn(cdn){
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        
        link.href = cdn;
        document.body.appendChild(link);
    }
    
    
}
// Super abstract class for wishlist apis
class WishlistApi {
    
    constructor(api, button, data) {
        if(this.constructor == WishlistApi) throw new Error(" Object of Abstract Class cannot be created");
            
        this.end_point = APP_URL+api
        this.button = button
        this.cookiesManager = new CookiesManager()
        this.data = data
    }

    // These methods should be implemented (override)
    callApi(){
        throw new Error('You have to implement the method callApi');
    }
    buttonSwitch(){
        throw new Error('You have to implement the method buttonSwitch');
    }

    async postData(data = {}) {
        // Default options are marked with *
        const response = await fetch('https://gorest.co.in/public/v2/users', {
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
        if(this.button.disabled) this.button.disabled = false
        this.button.classList.add('active');
        this.button.innerText = "Add To Wishlist";
        return "Remove From Wishlist ";
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

    //set next state to follow
    nextState(){
        let nextState = new RemoveFromWishlist(this.button, this.data)
        return nextState
    }


    callApi(){
        console.log(this.end_point);
        let loadingState = new LoadingWishlistNextState(null, this.button)
        loadingState.buttonSwitch('Adding to wishlist...')
        super.postData(this.data).then(response => {
              // Switch the wishlist button to the correct mode
            //  buttonSwitch(buttonMode.REMOVE), setWishlistCookies(data.product_id)
              // fire response notification
              notification('success', 'product added to wishlist')
              return this.nextState().buttonSwitch()
          })
          .catch(error => {
              // fire error notification
              notification('error', 'Oops!!.. something is wrong.\n can\'t add product to wishlist :(')
            // Reset button to add mode
            // resetButton()
          });
        // console.log(this.end_point);
        // let loadingState = new LoadingWishlistNextState(null, this.button)
        // loadingState.buttonSwitch('Adding to wishlist...')
        // var _this = this
        // setTimeout(function(){
        //     notification('success', 'product added to wishlist')
        //     return _this.nextState().buttonSwitch()
        // }, 2000);
    }
}

class RemoveFromWishlist extends WishlistApi {
    constructor(button, data) {
        super(API.REMOVE, button, data);
    }

    buttonSwitch(){
        if(this.button.disabled) this.button.disabled = false
        this.button.classList.remove('active');
        this.button.innerText = "Remove from Wishlist";
        return "Add to Wishlist";
    }

    nextState(){
        let nextState = new AddToWishlist(this.button, this.data)
        return nextState
    }

    callApi() {
        console.log(this.end_point);
        let loadingState = new LoadingWishlistNextState(null, this.button)
        loadingState.buttonSwitch('Removing from wishlist...')
        super.postData(this.data).then(response => {
              // Switch the wishlist button to the correct mode
            //  buttonSwitch(buttonMode.REMOVE), setWishlistCookies(data.product_id)
              // fire response notification
              notification('success', 'product added to wishlist')
              return this.nextState().buttonSwitch()
          })
          .catch(error => {
              // fire error notification
              notification('error', 'Oops!!.. something is wrong.\n can\'t add product to wishlist :(')
            // Reset button to add mode
            // resetButton()
          });
        // console.log(this.end_point);
        // let loadingState = new LoadingWishlistNextState(null, this.button)
        // loadingState.buttonSwitch('Adding to wishlist...')
        // var _this = this
        // setTimeout(function(){
        //     notification('success', 'product added to wishlist')
        //     return _this.nextState().buttonSwitch()
        // }, 2000);
    }
}

class CheckWishlist extends WishlistApi {
    constructor(button) {
        super(API.CHECK, button);
    }

    callApi() {
        console.log(this.end_point);
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
        console.log(this.end_point);
    }

    buttonSwitch(){
        this.button.classList.add('active');
        this.button.innerText = "Add To Wishlist";
        return "Add To Wishlist";
    }
}

class LoadingWishlistNextState extends WishlistApi {

    callApi() {
        return;
    }

    buttonSwitch(innerText = ''){
        this.button.disabled = true;
        this.button.innerText = innerText;
        return innerText;
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

    setProductsIdsCookie(pr_id){
        let products_ids_cookie = this.getCookie('ws_products')
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


// usage
const wishlistManager = new WishlistManager('wishlist-button');
// noty cdn
wishlistManager.javascriptCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js')
wishlistManager.cssCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.css');

// wishlistManager.change();

// console.log(wishlistManager.buttonSwitch()); 

// wishlistManager.change();

// console.log(wishlistManager.buttonSwitch()); 

// wishlistManager.change();

// console.log(wishlistManager.buttonSwitch()); 

// wishlistManager.change();

// console.log(wishlistManager.buttonSwitch());

function myFunction() {
    // Add to wishlist if button is active
    // switch button label after adding product to wishlist (Remove from wishlist)
    if(wishlistManager.isWishlistButtonActive()){
        // Switch button to remove
        //buttonSwitch(buttonMode.REMOVE)
        // Add to wishlist function
        //callApi()
        wishlistManager.addToWishlist().callApi()
    }
    // Remove product from wishlist if buuton is not active
    // switch button label after removing from wishlist (Add to wishlist)
    else{
        // Switch button to add
        //buttonSwitch()
        // Remove from wishlist
        //callApi(buttonMode.REMOVE)
        wishlistManager.removeFromWishlist().callApi()
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