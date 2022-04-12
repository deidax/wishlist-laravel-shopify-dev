<?php

namespace App\Models;

use App\Traits\GraphQlBuilder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Product extends Model
{
    use HasFactory, GraphQlBuilder;

    public static function GraphQl(){
        $shop = Auth::user();

        $products_in_wishlist = Wishlist::where('shop_id', $shop->name)->orderBy('updated_at', 'desc')->get();
        
        $products_id = $products_in_wishlist->pluck('product_id');
        
        $products_gid = self::mapForGids("Product", $products_id);
        $graphql = self::graphqlQuery($products_gid);
        $products_list = $shop->api()->graph($graphql);

        return $products_list;
    }

    public static function writeQuery(){
        return "
            ...on Product{
              id
              title
              handle
              description
              totalInventory
              createdAt
              images(first: 1) {
                  edges {
                    node {
                      url
                    }
                  }
                }
              priceRangeV2{
                maxVariantPrice{
                  amount
                  currencyCode
                }
              }
            }";
    }

    

}
