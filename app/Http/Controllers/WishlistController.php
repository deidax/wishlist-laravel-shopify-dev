<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //add the product to wishlist
        $product_to_wishlist = Wishlist::updateOrCreate($request->all());
        if ($product_to_wishlist->wasRecentlyCreated) return sendNotification('success', 'Product added to wishlist');
        return sendNotification('info', 'Product already in wishlist');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Wishlist  $wishlist
     * @return \Illuminate\Http\Response
     */
    public function show(Wishlist $wishlist)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Wishlist  $wishlist
     * @return \Illuminate\Http\Response
     */
    public function edit(Wishlist $wishlist)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Wishlist  $wishlist
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Wishlist $wishlist)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        //find product in wishlist
        $product = $this->getProductInWishlist($request);
        // remove product from db
        Wishlist::destroy($product->id);
        // send notification to client
        return sendNotification('warning', 'Product Removed from wishlist');
    }

    /**
     * Check if product exists in wishlist
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function checkIfInWishlist(Request $request)
    {
        //find product in wishlist
        $product = $this->getProductInWishlist($request);
        
        return $product == true;
    }

    // find product in customer's wishlist
    public function getProductInWishlist(Request $request)
    {
        return Wishlist::where('shop_id', $request['shop_id'])
                        ->where('customer_id', $request['customer_id'])
                        ->where('product_id', $request['product_id'])
                        ->first();
    }
    
    
}
