<?php

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

    Route::get('/', [
        function () {
            return view('shopify-app::home.index');
        }
    ])->name('home');

    

});

// proxy test
Route::get('/proxy', function () {
    return response('Hello, world!')->withHeaders(['Content-Type' => 'application/liquid']);
 })->middleware('auth.proxy');

