// APIs Enum
const API = {
    ADD: '/api/add-to-wishlist',
    REMOVE: '/api/remove-from-wishlist',
    CHECK: '/api/check-wishlist',
    UPDATE_CUSTOMER_ID: '/api/update-customer-id-wishlist'
}
// APP URL
const APP_URL = 'https://dev.myshopifyapp.com'

// Class To manage Wishlist states
class WishlistManager {
    constructor(wishlist_button_selector) {
        // select the wishlist button
        this.button = document.querySelector('.'+wishlist_button_selector)
        // Product id
        this.product_id = this.button.dataset.product
        // Product price
        this.product_price = this.button.dataset.product_price.replace(',', '')
        // Customer id
        this.customer_id = this.button.dataset.customer != "" ? this.button.dataset.customer : this.checkIfNotSetCookie('ws_customer',this.uuidv4())
        // Data to send to the Api
        this.data = {
            'shop_id': 'test.shop',
            'product_id': this.product_id,
            'product_price': this.product_price,
            'customer_id': this.customer_id
        }
        console.log('data', this.data)
        this.states = [new AddToWishlist(), new RemoveFromWishlist(), new CheckWishlist(), new UpdateCustomerIdWishlist()];
        this.current = this.states[0];
    }
  
    change() {
      const totalStates = this.states.length;
      console.log("this.current",this.current);
      let currentIndex = this.states.findIndex(light => light === this.current);
      if (currentIndex + 1 < totalStates) this.current = this.states[currentIndex + 1];
      else this.current = this.states[0];
    }

    // Check if cookie is set
    checkIfNotSetCookie(cname, default_cvalue) {
        let cvalue = getCookie(cname);
        return cvalue != "" ? cvalue : default_cvalue;
    }

    // Call the correct api
    callApi() {
      return this.current.callApi();
    }

    // create a unique id (will be used for customer)
    uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
}
// Super abstract class for wishlist apis
class WishlitApi {
    
    constructor(api, button) {
        if(this.constructor == WishlitApi) throw new Error(" Object of Abstract Class cannot be created");
            
        this.end_point = APP_URL+api
        this.button = button
    }

    // This method should be implemented (override)
    callApi(){
        throw new Error('You have to implement the method callApi');
    }
}

class AddToWishlist extends WishlitApi {
    constructor() {
        super(API.ADD);
    }

    callApi() {

        return this.end_point;
    }
}

class RemoveFromWishlist extends WishlitApi {
    constructor() {
        super(API.REMOVE);
    }

    callApi() {
        return this.end_point;
    }
}

class CheckWishlist extends WishlitApi {
    constructor() {
        super(API.CHECK);
    }

    callApi() {
        return this.end_point;
    }
}

class  UpdateCustomerIdWishlist extends WishlitApi {
    constructor() {
        super(API.UPDATE_CUSTOMER_ID);
    }

    callApi() {
        return this.end_point;
    }
}

function myFunction() {
    alert('kabbbom')
}

// usage
const wishlistManager = new WishlistManager('wishlist-button');

console.log(wishlistManager.callApi()); 
wishlistManager.change();

console.log(wishlistManager.callApi()); 
wishlistManager.change();

console.log(wishlistManager.callApi()); 
wishlistManager.change();

console.log(wishlistManager.callApi()); 
wishlistManager.change();

console.log(wishlistManager.callApi()); 