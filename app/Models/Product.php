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

        $graphql = self::graphqlQuery($products_gid);
        
        $products_list = $shop->api()->graph($graphql);

        return $products_list;
    }

    public static function buildGid($product_id){
        return "gid://shopify/Product/{$product_id}";
    }

    public static function getProductsDataOnly($graphql){
        return $graphql['body']->container['data']['nodes'];
    }

    public static function graphqlQuery($gids){
        return "
        {
            nodes(ids:$gids){
              ...on Product{
                id
                title
                handle
                description
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
              }
            }
          }
        ";
    }


}
