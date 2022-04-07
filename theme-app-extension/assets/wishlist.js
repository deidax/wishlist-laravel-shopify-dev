// require("noty/src/noty.scss");
// require("noty/src/themes/mint.scss");
// import './require.js'
window.Noty = require('noty');


function myFunction() {
  const button = document.querySelector('.wishlist-button')
  if(button.classList.contains('active')){
    button.classList.remove('active')
    button.innerText = "Remove From Wishlist";
  }
  else{
    button.classList.add('active')
    button.innerText = "Add To Wishlist";
    new Noty({
        type: 'success',
        layout: 'topRight',
        text: 'Some notification text'
    }).show();
  }
}
