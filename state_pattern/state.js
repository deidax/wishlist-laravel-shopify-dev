const API = {
    ADD: '/api/add-to-wishlist',
    REMOVE: '/api/remove-from-wishlist',
    CHECK: '/api/check-wishlist',
    UPDATE_CUSTOMER_ID: '/api/update-customer-id-wishlist'
}

class WishlistButton {
    constructor() {
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

    
    execute() {
      return this.current.execute();
    }
}
// super class
class WishlitApi {
    
    constructor(api) {
        this.api = api
        this.app_url = 'https://dev.myshopifyapp.com'
    }

    callApi(){
        return this.app_url + this.api
    }
}

class AddToWishlist extends WishlitApi {
    constructor() {
        super(API.ADD);
    }

    execute() {
        return super.callApi();
    }
}

class RemoveFromWishlist extends WishlitApi {
    constructor() {
        super(API.REMOVE);
    }

    execute() {
        return super.callApi();
    }
}

class CheckWishlist extends WishlitApi {
    constructor() {
        super(API.CHECK);
    }

    execute() {
        return super.callApi();
    }
}

class  UpdateCustomerIdWishlist extends WishlitApi {
    constructor() {
        super(API.UPDATE_CUSTOMER_ID);
    }

    execute() {
        return super.callApi();
    }
}

function myFunction() {
    alert('kabbbom')
}

// usage
const wishlistButton = new WishlistButton();

console.log(wishlistButton.execute()); // 'GO'
wishlistButton.change();

console.log(wishlistButton.execute()); // 'STOP'
wishlistButton.change();

console.log(wishlistButton.execute()); // 'STEADY'
wishlistButton.change();

console.log(wishlistButton.execute()); // 'GO'
wishlistButton.change();

console.log(wishlistButton.execute()); // 'STOP'