<?php

namespace App\Models;

use App\Interfaces\IGraphQlBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| GraphQl Abstract class
|--------------------------------------------------------------------------
|
| This class will be used to make it easy to use graphql
|
*/
abstract class GraphQlBuilder extends Model implements IGraphQlBuilder
{
    /**
     * Get shopify GraphQl information from wishlist table
     *
     * @param  string  $id_name the name of id in the wishlist model
     * @param  string  $selector the Query selector
     * @return void
     */
    public static function WishlistGraphQl($id_name, $selector){
        $shop = Auth::user();

        $products_in_wishlist = Wishlist::where('shop_id', $shop->name)->orderBy('updated_at', 'desc')->get();
        
        $products_id = $products_in_wishlist->pluck($id_name);
        
        $products_gid = self::mapForGids($selector, $products_id);
        $graphql = self::graphqlQueryWithGids(array_unique($products_gid));
        $products_list = $shop->api()->graph($graphql);

        return $products_list;
    }

    //Create the gid
    public static function buildGid($product_id, $selector){
        return "gid://shopify/{$selector}/{$product_id}";
    }
    //get the main data
    public static function getDataOnly($graphql){
        return $graphql['body']->container['data']['nodes'];
    }

    public static function graphqlQueryWithGids($gids){
        $gids = json_encode($gids);
        $query = static::writeQueryWithGids();
        return "
        {
            nodes(ids:$gids){
                $query
            }
          }
        ";
    }


    public static function mapForGids($selector, $gids){
        return array_map(function ($item) use ($selector, $gids){
                return self::buildGid($item, $selector);
        }, $gids->toArray());
    }
}
