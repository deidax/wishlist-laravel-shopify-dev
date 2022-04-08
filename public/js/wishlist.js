/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************************************!*\
  !*** ./theme-app-extension/assets/wishlist.js ***!
  \************************************************/
// nofy lib
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js';
document.body.appendChild(script);
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.css';
document.body.appendChild(link); // wishlist function

function myFunction() {
  var button = document.querySelector('.wishlist-button');

  if (button.classList.contains('active')) {
    button.classList.remove('active');
    button.innerText = "Remove From Wishlist";
    notification('success', 'Product added to wishlist');
  } else {
    button.classList.add('active');
    button.innerText = "Add To Wishlist";
    notification('warning', 'Product removed from wishlist');
  }
}

function notification(type, text) {
  new Noty({
    type: type,
    layout: 'topRight',
    text: text,
    timeout: 3000
  }).show();
}
/******/ })()
;