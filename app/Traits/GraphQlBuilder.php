<?php

namespace App\Traits;




/*
|--------------------------------------------------------------------------
| GraphQl Trait
|--------------------------------------------------------------------------
|
| This trait will be used to make it easy to use graphql
|
*/
trait GraphQlBuilder
{
    //Create the gid
    public static function buildGid($product_id, $selector){
        return "gid://shopify/{$selector}/{$product_id}";
    }
    //get the main data
    public static function getProductsDataOnly($graphql){
        return $graphql['body']->container['data']['nodes'];
    }

    public static function graphqlQuery($gids){
        $gids = json_encode($gids);
        $query = self::writeQuery();
        return "
        {
            nodes(ids:$gids){
                $query
            }
          }
        ";
    }

    public static function writeQuery(){
        return 'Write your GraphQl query here';
    }

    public static function mapForGids($selector, $gids){
        return array_map(function ($item) use ($selector, $gids){
                return self::buildGid($item, $selector);
        }, $gids->toArray());
    }
}
