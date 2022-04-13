<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(){

        $wishlist_ql = Product::WishlistGraphQl("product_id", "Product");
        $wishlist = Product::getDataOnly($wishlist_ql);
        
        return view('products', compact('wishlist'));
    }
}
