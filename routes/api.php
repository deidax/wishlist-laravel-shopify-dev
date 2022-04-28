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

// App api
Route::group(['middleware' => 'verify.shopify'], function () {
    Route::get('/v1/dashboard', [DashboardController::class, "getInfo"])->name('home');

    Route::get('/v1/products', [ProductController::class, "index"])->name('wishlist');

    // sort customers.
    // exemple of api result.
    // 0 => array:6 [
    //     "id" => "417160b1-06c6-43f2-8cf8-f3a2eab1c983"
    //     "displayName" => "Guest"
    //     "email" => null
    //     "number_wishlisted" => 3
    //     "numbre_price_wishlisted" => 157250.0
    //     "string_price_wishlisted" => "157250 MAD"
    //   ]
    // 1 => array:6 [
    //     "id" => "5572067459095"
    //     "displayName" => "Adam Smith"
    //     "email" => "sigma@gmail.com"
    //     "number_wishlisted" => 2
    //     "numbre_price_wishlisted" => 150250.0
    //     "string_price_wishlisted" => "150250 MAD"
    //     ]
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
    

    Route::get('/v1/configure-theme-api-docs', function () {
        return view('api-docs.configure-theme');
    })->name('api-docs.configure.theme');


    Route::post('/v1/configure-theme', [SettingController::class, "ConfigureTheme"])->name('configure.theme');
    Route::get('/v1/theme-activated', [SettingController::class, "isThemeActivated"])->name('theme.activated');
});
