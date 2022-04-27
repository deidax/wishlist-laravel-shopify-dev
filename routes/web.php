<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SwaggerController;
use App\Models\Wishlist;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::group(['middleware' => 'verify.shopify'], function () {
    // Route::get('/', function () {
    //     return view('home');
    // })->name('home');
    
    // Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    // Route::get('/{any?}', [
    //     function () {
    //         // return view('app');
    //         return "ok";
    //     }
    // ])->where('any', '.*');

    Route::get('/', [
        function () {
            return view('shopify-app::home.index');
        }
    ])->name('home');

    // Route::get('/products', [ProductController::class, "index"])->name('wishlist');

    // Route::get('/customers',[CustomerController::class, "index"])->name('customers');

    // Route::get('/settings', function () {
    //     return view('settings');
    // })->name('settings');

    // Route::post('/configure-theme', [SettingController::class, "ConfigureTheme"])->name('configure.theme');

    // Route::get('/swagger', [SwaggerController::class, "index"])->name('swagger');
    

});

