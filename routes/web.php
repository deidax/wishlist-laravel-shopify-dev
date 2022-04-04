<?php

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
    Route::get('/', function () {
        return view('home');
    })->name('home');
    
    Route::get('/products', function () {
        return view('products');
    })->name('products');

    Route::get('/customers', function () {
        return view('customers');
    })->name('customers');

    Route::get('/settings', function () {
        return view('settings');
    })->name('settings');

    Route::get('/test', function () {
        $shop = Auth::user();
        $themes = $shop->api()->rest('GET', '/admin/api/2022-04/themes.json');

        $shopThemes = $themes['body']['themes'];

        $searchedThemeRole = "main";

        $activeTheme = array_filter(
            $shopThemes->toArray(),
            function ($e) use (&$searchedThemeRole) {
                return $e['role'] == $searchedThemeRole;
            }
        );

        $activeThemeId = $activeTheme[0]['id'];

        $snippet = "Your snippet code";

        //Snippet to pass to rest api request
        $data = array(
            'asset'=> [
                'key' => 'snippets/deidax-wishlist-app-laravel.liquid', 
                'value' => $snippet
            ]
        );

        $shop->api()->rest('PUT', '/admin/api/2022-04/themes/'.$activeThemeId.'/assets.json', $data);

        return "Success!";
        

    })->name('test');

});


// Route::get('/', function () {
//     return view('dashboard');
// })->middleware(['verify.shopify'])->name('home');

// Route::get('/products', function () {
//     return view('products');
// })->name('products');
