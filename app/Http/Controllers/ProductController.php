<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

class ProductController extends Controller
{
    public function index()
    {

        $wishlist_ql = Product::WishlistGraphQl("product_id", "Product");
        $wishlist = Product::getDataOnly($wishlist_ql);

        $wishlist_data = new ProductResource($wishlist);


        return $wishlist_data;
    }
}
