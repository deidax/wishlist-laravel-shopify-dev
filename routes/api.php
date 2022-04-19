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
    Route::get('/v1/dashboard', [DashboardController::class, "index"])->name('home');
    
    Route::get('/v1/products', [ProductController::class, "index"])->name('wishlist');

    Route::get('/v1/customers',[CustomerController::class, "index"])->name('customers');

    
    Route::get('/v1/configure-theme-api-docs', function () {
        return view('api-docs.configure-theme');
    })->name('api-docs.configure.theme');
    

    Route::post('/v1/configure-theme', [SettingController::class, "ConfigureTheme"])->name('configure.theme');
    Route::get('/v1/theme-activated',[SettingController::class, "isThemeActivated"])->name('theme.activated');

    

});
