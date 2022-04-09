<?php

use App\Http\Controllers\WishlistController;
use Illuminate\Http\Request;
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
