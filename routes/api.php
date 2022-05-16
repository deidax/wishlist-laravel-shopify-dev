<?php

use App\Http\Controllers\WishlistController;
use Illuminate\Http\Request;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Add to wishlist api
Route::post('/add-to-wishlist', [WishlistController::class, "store"])->name('add.to.wishlist');
Route::post('/remove-from-wishlist', [WishlistController::class, "destroy"])->name('remove.from.wishlist');
Route::post('/check-wishlist', [WishlistController::class, "checkIfInWishlist"])->name('check.wishlist');
Route::post('/update-customer-id-wishlist', [WishlistController::class, "update"])->name('update.customer.id.wishlist');
Route::post('/get-social-count', [WishlistController::class, "getWishlistSocialCount"])->name('get.social.count');
Route::post('/load-wishlist', [WishlistController::class, "loadWishlist"])->name('load.wishlist');

// settings api
Route::post('/get-button-params', [SettingController::class, "getButtonParams"])->name('get.button.params');

// App api
Route::group(['middleware' => 'verify.shopify'], function () {
    Route::get('/v1/dashboard', [DashboardController::class, "getInfo"])->name('home');

    //for testing only
    // Route::post('/v1/get-button-params', [SettingController::class, "getButtonParams"])->name('get.button.params');

    // get products data using graphql
    // [
    //  [
    //     "id" => "6713766215703"
    //     "title" => "Smart watch"
    //     "handle" => "t-shir"
    //     "description" => "La bla bla..."
    //     "totalInventory" => 0
    //     "vendor" => "appstoreplayground"
    //     "variants" => array:1 [
    //       "edges" => array:1 [
    //         0 => array:1 [
    //           "node" => array:2 [
    //             "id" => "gid://shopify/ProductVariant/39986421661719"
    //             "sku" => "SI-XD-1"
    //           ]
    //         ]
    //       ]
    //     ]
    //     "createdAt" => "2022-04-03T23:25:21Z"
    //     "images" => array:1 [
    //       "edges" => array:1 [
    //         0 => array:1 [
    //           "node" => array:1 [
    //             "url" => "https://cdn.shopify.com/s/files/1/0570/4174/7991/products/1.jpg?v=1649925269"
    //           ]
    //         ]
    //       ]
    //     ]
    //     "priceRangeV2" => array:1 [
    //       "maxVariantPrice" => array:2 [
    //         "amount" => "250.0"
    //         "currencyCode" => "MAD"
    //       ]
    //     ]
    //     "number_of_customers" => 2
    //   ],
    //    ...
    // ]
    // orderBy and number are optional
    // orderBy accept DESC | ASC (string)
    // number is the number of results to show (exemple: number = 10 for Top10 products) (int)
    // sorting will be by the number_of_customers
    Route::get('/v1/products/{orderBy?}/{number?}', [ProductController::class, "index"])->name('wishlist');

    // sort customers.
    // exemple of api result.
    // 0 => array:6 [
    //     "id" => "417160b1-06c6-43f2-8cf8-f3a2eab1c983"
    //     "displayName" => "Guest"
    //     "email" => null
    //     "number_wishlisted" => 3
    //     "numbre_price_wishlisted" => 157250.0
    //     "string_price_wishlisted" => "157250 MAD"
    //   ],
    // 1 => array:6 [
    //     "id" => "5572067459095"
    //     "displayName" => "Adam Smith"
    //     "email" => "sigma@gmail.com"
    //     "number_wishlisted" => 2
    //     "numbre_price_wishlisted" => 150250.0
    //     "string_price_wishlisted" => "150250 MAD"
    //     ],
    // 2 => array:6 [
    //     "id" => "5577605677079"
    //     "displayName" => "David Locas"
    //     "email" => "alpha@gmail.com"
    //     "number_wishlisted" => 1
    //     "numbre_price_wishlisted" => 12500.0
    //     "string_price_wishlisted" => "12500 MAD"
    //     ]
    // ]
    // sortBy, orderBy and number are optional
    // sortBy is the key value to sort with (string)
    // orderBy accept DESC | ASC (string)
    // number is the number of results to show (exemple: number = 10 for Top10 customers) (int)
    // exemple: get Top10 customers in wishlist : /v1/customers/number_wishlisted/DESC/10
    Route::get('/v1/customers/{sortBy?}/{orderBy?}/{number?}', [CustomerController::class, "index"])->name('customers');
    

    Route::get('/v1/get-store-themes', [SettingController::class, "getStoreThemes"])->name('get.store.theme');


    //params:
    // display_social_count: bool
    // button_type: enum ['text', 'icon', 'text_icon']
    // button_icon: enum ['like', 'star', 'heart'] 
    // btn_label_before: string
    // btn_label_after: string
    // bg_color_before: string (hex)
    // bg_color_after: string (hex)
    // text_color_before: string (hex) 
    // text_color_after: string (hex)
    Route::post('/v1/configure-theme', [SettingController::class, "ConfigureTheme"])->name('configure.theme');
    
    Route::get('/v1/theme-activated', [SettingController::class, "isThemeActivated"])->name('theme.activated');
    
    Route::get('/v1/get-button-params-app', [SettingController::class, "getButtonParamsApp"])->name('get.button.params.app');
});


