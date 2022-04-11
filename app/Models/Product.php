<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Product extends Model
{
    use HasFactory;

    public static function GraphQl(){
        $shop = Auth::user();

        $products_in_wishlist = Wishlist::where('shop_id', $shop->name)->orderBy('updated_at', 'desc')->get();
        
        $products_id = $products_in_wishlist->pluck('product_id');
        $products_gid = array_map([__CLASS__,"buildGid"], $products_id->toArray());

        $products_gid = json_encode($products_gid);

        $graphql = "
        {
            nodes(ids:$products_gid){
              ...on Product{
                id
                title
                handle
                priceRangeV2{
                  maxVariantPrice{
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        ";
        
        $products_list = $shop->api()->graph($graphql);

        return $products_list;
    }

    private static function buildGid($product_id){
        return "gid://shopify/Product/{$product_id}";
    }
}
