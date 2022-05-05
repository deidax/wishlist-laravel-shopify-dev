// APIs Enum
const API = {
    ADD: '/api/add-to-wishlist',
    REMOVE: '/api/remove-from-wishlist',
    CHECK: '/api/check-wishlist',
    UPDATE_CUSTOMER_ID: '/api/update-customer-id-wishlist',
    BUILD_WISHLIST_BUTTON: '/api/get-button-params'
}
// Wishlist button
const WISHLIST_BUTTON = {
    BUTTON_DATA: 'ws_button_data',
    BUTTON_HANDLE: 'wh_button_handle',
    BUTTON_TEXT_WRAPPER_BEFORE: 'addto_wl_text_wrapp_before',
    BUTTON_TEXT_WRAPPER_AFTER: 'addto_wl_text_wrapp_after'
}
// APP URL
const APP_URL = 'https://dev.myshopifyapp.com'
const cookies_days = 365
// Regular expression to check if string is a valid UUID
const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;


// Class To manage Wishlist states
class WishlistManager {
    constructor(wishlist_button_selector) {
        // select the wishlist button
        this.button = document.querySelector('#'+wishlist_button_selector)
        this.cookiesManager = new CookiesManager()
        // Product id
        this.product_id = this.button.dataset.product
        // Product price
        this.product_price = this.button.dataset.product_price.replace(',', '')
        // Customer id
        this.customer_id = this.button.dataset.customer != "" ? this.button.dataset.customer : this.cookiesManager.checkIfNotSetCookie('ws_customer',this.uuidv4())
        // Create a uuidv4 id to use later
        if(regexExp.test(this.customer_id)){
            // This will be used to update the customer id in the backend
            this.cookiesManager.setCookie('ws_uuid_customer_id', this.customer_id)
        }
        //set customer_id cookie
        this.cookiesManager.setCookie('ws_customer', this.customer_id)
        // Data to send to the Api
        this.data = {
            'shop_id': Shopify.shop,
            'product_id': this.product_id,
            'product_price': this.product_price,
            'customer_id': this.customer_id,
            'uuid_customer_id': this.cookiesManager.getCookie('ws_uuid_customer_id')
        }
        console.log('data', this.data)
        //default state is CheckWishlist 
        this.initWishlist();
    }

    initWishlist()
    {
        //default state is CheckWishlist 
        // let updateCustomerIdWishlist = this.updateCustomerIdWishlist()
        // let initState = updateCustomerIdWishlist.checkIfCustomerConnected()
        // initState.buttonSwitch()
        // initState.nextState()
        let buildButton = this.buildWishlistButton()
        buildButton.callApi()
    }


    isWishlistButtonActive()
    {
        return this.button.firstChild.classList.contains('active')
    }
    
    buildWishlistButton()
    {
        return new BuildWishlistButton(this.button, this.data);
    }

    addToWishlist()
    {
        return new AddToWishlist(this.button, this.data);
    }

    removeFromWishlist()
    {
        return new RemoveFromWishlist(this.button, this.data);
    }

    checkWishlist()
    {
        return new CheckWishlist(this.button, this.data);
    }

    updateCustomerIdWishlist()
    {
        return new UpdateCustomerIdWishlist(this.button, this.data)
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
    
    constructor(api, button, data = {}) {
        if(this.constructor == WishlistApi) throw new Error(" Object of Abstract Class cannot be created");
            
        this.end_point = APP_URL+api
        this.button = button
        this.cookiesManager = new CookiesManager()
        this.data = data

    }
    
    getCustomizedButton(){
        let customized_wishlist_button = document.querySelector('#'+WISHLIST_BUTTON.BUTTON_HANDLE)
        return customized_wishlist_button
    }
    
    setWishListButtonToActive(){
        this.getCustomizedButton().style.pointerEvents = 'auto';
        this.getCustomizedButton().classList.add('active');
        let text_loading = this.getCustomizedButton().querySelector('#text_loading')
        let wl_text_wrapp_before = this.getCustomizedButton().querySelector('#'+WISHLIST_BUTTON.BUTTON_TEXT_WRAPPER_BEFORE)
        let wl_text_wrapp_after = this.getCustomizedButton().querySelector('#'+WISHLIST_BUTTON.BUTTON_TEXT_WRAPPER_AFTER)
        if(text_loading != null ) text_loading.style.display = 'none'
        wl_text_wrapp_before.style.display = 'block'
        wl_text_wrapp_after.style.display = 'none'
    }

    setWishListButtonToInActive(){
        this.getCustomizedButton().style.pointerEvents = 'auto';
        this.getCustomizedButton().classList.remove('active');
        let text_loading = this.getCustomizedButton().querySelector('#text_loading')
        let wl_text_wrapp_before = this.getCustomizedButton().querySelector('#'+WISHLIST_BUTTON.BUTTON_TEXT_WRAPPER_BEFORE)
        let wl_text_wrapp_after = this.getCustomizedButton().querySelector('#'+WISHLIST_BUTTON.BUTTON_TEXT_WRAPPER_AFTER)
        if(text_loading != null ) text_loading.style.display = 'none'
        wl_text_wrapp_before.style.display = 'none'
        wl_text_wrapp_after.style.display = 'block'
    }

    setTextForWishListButton(text){
        
        //set text loading span
        this.getCustomizedButton().style.pointerEvents = 'none';
        console.log('cursor', this.getCustomizedButton().style.pointerEvents)
        this.getCustomizedButton().querySelector("#text_loading") != undefined ? 
        (this.getCustomizedButton().querySelector("#text_loading").style.display = 'block', this.getCustomizedButton().querySelector("#text_loading").innerHTML = text) : 
            this.getCustomizedButton().insertAdjacentHTML("afterbegin","<span id='text_loading'>"+text+"</span>");
        
        console.log(text)
        console.log('this.getCustomizedButton().querySelector("#text_loading")', this.getCustomizedButton().querySelector("#text_loading"))
        this.getCustomizedButton().querySelector('#'+WISHLIST_BUTTON.BUTTON_TEXT_WRAPPER_BEFORE).style.display = 'none'
        this.getCustomizedButton().querySelector('#'+WISHLIST_BUTTON.BUTTON_TEXT_WRAPPER_AFTER).style.display = 'none'
        
    }


    // These methods should be implemented (override)
    callApi(){
        throw new Error('You have to implement the method callApi');
    }
    buttonSwitch(){
        throw new Error('You have to implement the method buttonSwitch');
    }
    //post
    async postData(data = {}) {
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


class BuildWishlistButton extends WishlistApi {

    constructor(button, data) {
        super(API.BUILD_WISHLIST_BUTTON, button, data)
        this.shop_data = {
            'shop_id': Shopify.shop,
            'shop_active_theme_id': Shopify.theme.id
        }
    }

    nextState(){
        console.log('build called!')
        let nextState = new UpdateCustomerIdWishlist(this.button, this.data)
        return nextState
    }

    buttonSwitch(innerText = ''){
        return;
    }

    pleaseActivateWishlistTheme(activation_message)
    {
        this.button.innerText = activation_message  ?? 'Please activate wishlist theme in app settings';
    }

    callApi() {
        console.log(this.end_point);
        //let loadingState = new LoadingWishlistNextState(null, this.button)
        //loadingState.buttonSwitch('Adding to wishlist...')
        super.postData(this.shop_data).then(response => {
                // return 
                if(response.type != undefined && response.type == "error")
                {
                    this.pleaseActivateWishlistTheme(response.message)
                }
                else 
                {
                    this.button.innerHTML = response.innerHtml
                    super.getCustomizedButton().setAttribute("onclick","myFunction();");
                    let updateCustomerIdWishlist = this.nextState()
                    let checkWishlist = updateCustomerIdWishlist.checkIfCustomerConnected()
                    //checkWishlist.nextState()
                    // updateCustomerIdWishlist.buttonSwitch()
                    //updateCustomerIdWishlist.nextState()
                }
                
          })
          .catch(error => {
              // fire error notification
              console.log(error)
          });
    }

}

class AddToWishlist extends WishlistApi {
    constructor(button, data) {
        super(API.ADD, button, data);
    }


    buttonSwitch(){
        // if(this.button.disabled) this.button.disabled = false
        super.setWishListButtonToActive()
        // this.button.innerText = "Add To Wishlist";
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
                this.cookiesManager.addProductsIdToCookies(this.data.product_id)
                notification(response.type, response.message)
                return this.nextState().buttonSwitch()
          })
          .catch(error => {
              // fire error notification
              console.log('error', error)
              notification('error', 'Oops!!.. something is wrong.\n can\'t add product to wishlist :(')
          });
    }
}

class RemoveFromWishlist extends WishlistApi {
    constructor(button, data) {
        super(API.REMOVE, button, data);
    }

    buttonSwitch(){
        //if(this.button.disabled) this.button.disabled = false
        super.setWishListButtonToInActive()
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
              this.cookiesManager.removeProductsIdFromCookies(this.data.product_id)
              notification(response.type, response.message)
              return this.nextState().buttonSwitch()
          })
          .catch(error => {
              // fire error notification
              notification('error', 'Oops!!.. something is wrong.\n can\'t add product to wishlist :(')
          });
    }
}

class CheckWishlist extends WishlistApi {
    constructor(button, data) {
        super(API.CHECK, button, data);
    }

    nextState(){
        // check if products is already in products cookie
        // if product exist in products cookie we don't need to do an api call, and we move to the next button state
        let products_ids_cookie = this.cookiesManager.getCookie('ws_products')
        if(products_ids_cookie != "" && products_ids_cookie != null){
            
            // get the products ids into array
            let products_ids = JSON.parse(products_ids_cookie)
            // check if product in cookie
            // if true button state should be on the Remove
            if(products_ids.includes(this.data.product_id)){
                let nextState = new RemoveFromWishlist(this.button, this.data)
                return nextState.buttonSwitch()
            }
            //if not, we should double check if product exists in the backend and add it again to product cookie
            
            this.callApi()
            
        }
        // The ws_products cookie could be empty or it doesn't exist so we double check the backend,
        // and we move to the next State
        this.callApi()
    }

    buttonSwitch(){
        // this.button.classList.add('active');
        // this.button.innerText = "Add To Wishlist";
        // return "Add To Wishlist";
    }

    callApi() {
        console.log(this.end_point);
        let loadingState = new LoadingWishlistNextState(null, this.button)
        loadingState.buttonSwitch('Checking wishlist...')
        super.postData(this.data).then((response) => {
            console.log('checklist respinse', response)
            var nextState = null
            if(response === 1){
                // add the product id to the cookie and set the button next state
                this.cookiesManager.addProductsIdToCookies(this.data.product_id)
                nextState = new RemoveFromWishlist(this.button, this.data)
                return nextState.buttonSwitch()
            }
            nextState = new AddToWishlist(this.button, this.data)
            return nextState.buttonSwitch()
        })
        .catch(error => {
            // fire error notification
            console.log('error', error)
            notification('error', 'Oops!!.. something is wrong.\n can\'t add product to wishlist :(')
        });
    }
}

class  UpdateCustomerIdWishlist extends WishlistApi {
    constructor(button, data) {
        super(API.UPDATE_CUSTOMER_ID, button, data);
    }

    
    buttonSwitch(){
        return;
    }

    nextState(){
        let nextState = new CheckWishlist(this.button, this.data)
        nextState.nextState()
        return nextState
    }

    // Check if customer is connected and update db user id with customer's shopifyId
    checkIfCustomerConnected(){
        let c_uuid = this.cookiesManager.getCookie('ws_customer') //get customer uuid from cookies
        let products_ids_cookie = this.cookiesManager.getCookie('ws_products') //get customer uuid from cookies
        let products_ids = []
        if(products_ids_cookie != "" && products_ids_cookie != null)
        {
            products_ids = JSON.parse(products_ids_cookie)
        }
        if(c_uuid != "" && c_uuid != null && typeof c_uuid != undefined && !regexExp.test(c_uuid) && this.button.dataset.customer != "" && products_ids.length > 0){
            return this.callApi()
        }

        return this.nextState()

    }   

    callApi() {
        console.log(this.end_point);
        let loadingState = new LoadingWishlistNextState(null, this.button)
        loadingState.buttonSwitch('Checking customer...')
        super.postData(this.data).then(response => {
                this.cookiesManager.setCookie('ws_customer', this.data.customer_id)
                return this.nextState()
          })
          .catch(error => {
              // fire error notification
              console.log('error', error)
          });
    }
}

class LoadingWishlistNextState extends WishlistApi {

    callApi() {
        return;
    }

    buttonSwitch(innerText = ''){
        super.setTextForWishListButton(innerText)
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
    setCookie(cname, cvalue, exdays = cookies_days) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    // Delete cookie
    deleteCookie(cname) {
        document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    addProductsIdToCookies(pr_id){
        // Get value of ws_products cookie
        let products_ids_cookie = this.getCookie('ws_products')
        // Check if it's not null or empty
        if(products_ids_cookie != "" && products_ids_cookie != null){
            // get the products ids into array
            let products_ids = JSON.parse(products_ids_cookie)
            // Push new product id into array (without duplicates)
            if(!products_ids.includes(pr_id)) products_ids.push(pr_id)
            // set the new cookie value for products
            this.setCookie('ws_products', JSON.stringify(products_ids))
        }

        else{
            // set the first cookie value for product
            this.setCookie('ws_products', JSON.stringify([pr_id]))
        }
    
    }

    removeProductsIdFromCookies(pr_id){
        // Get value of ws_products cookie
        let products_ids_cookie = this.getCookie('ws_products')
        if(products_ids_cookie != "" && products_ids_cookie != null){
            // get the products ids into array
            let products_ids = JSON.parse(products_ids_cookie)
            if(products_ids !== undefined || products_ids.length > 0){
                let tmp_products_ids = products_ids.filter((pid) => pid !== pr_id)
                console.log('tmp_products_ids',tmp_products_ids)
                tmp_products_ids != null && tmp_products_ids !== undefined
                products_ids = tmp_products_ids
                this.setCookie('ws_products', JSON.stringify(products_ids))
            }
        }
    }
}


// usage
const wishlistManager = new WishlistManager(WISHLIST_BUTTON.BUTTON_DATA);
// noty cdn
wishlistManager.javascriptCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js')
wishlistManager.cssCdn('https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.css');
// font awesome
wishlistManager.cssCdn('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css');


function myFunction() {
    // Add to wishlist if button is active
    // switch button label after adding product to wishlist (Remove from wishlist)
    if(wishlistManager.isWishlistButtonActive()){
        wishlistManager.addToWishlist().callApi()
    }
    // Remove product from wishlist if buuton is not active
    // switch button label after removing from wishlist (Add to wishlist)
    else{
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