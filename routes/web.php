<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SettingController;
use App\Models\Wishlist;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    
    // Route::get('/products', [ProductController::class, "index"])->name('wishlist');

    // Route::get('/customers',[CustomerController::class, "index"])->name('customers');

    // Route::get('/settings', function () {
    //     return view('settings');
    // })->name('settings');

    // Route::post('/configure-theme', [SettingController::class, "ConfigureTheme"])->name('configure.theme');

    // Route::get('/test', function () {
    //     return "testing...";
    // })->name('test');

    // route testing for Inertia js
    Route::get('/', function () {
        return Inertia::render('Home');
    })->name('home');
    Route::get('/users', function () {
        sleep(50);
        return Inertia::render('Users');
    })->name('users');

    Route::get('/settings', function () {
        return Inertia::render('Settings');
    })->name('settings');

});

