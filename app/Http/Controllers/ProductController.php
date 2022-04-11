<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(){

        $wishlist_ql = Product::GraphQl();
        $wishlist = Product::getProductsDataOnly($wishlist_ql);
        
        return view('partials.wishlist-products', compact('wishlist'));
    }
}
