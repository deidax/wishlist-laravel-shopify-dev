<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class Customer extends GraphQlBuilder
{
    use HasFactory;

    private static $guests_counter = 0;
    private static $customers_data = [];
    private static $guest_label = "Guest";
    private static $guests_uuids = [];
    private static $customers_with_account = []; 


    public static function mapForGids($selector, $gids){
        $cutomers_gids = array_map(function ($item) use ($selector){
            if(!Str::isUuid($item)) return self::buildGid($item, $selector);
            array_push(self::$guests_uuids, array('id' => $item));
        }, $gids->toArray());
        return array_unique(array_filter($cutomers_gids));
    }

    //get the main data
    public static function getDataOnly($graphql){
        $customers_with_account = self::buildCustomersWithAccountData($graphql['body']->container['data']['nodes']);
        $guests = self::buildGuestsData(self::$guests_uuids);
        $customers = array_merge($customers_with_account, $guests);
        
        return $customers;
    }

    public static function writeQueryWithGids(){
        return "
        ... on Customer {
            id
            displayName
        }
        ";
    }

    public static function writeQueryWithFirstOne(){
        return "no query yet";
    }

    public static function buildCustomersWithAccountData($customers_nodes){
        // customers with account
        $customers_with_account = array_map(function($customer_node){
            $customer_node['id'] = self::getNumericShopifyQl("Customer",$customer_node['id']);
            $customer_node['number_wishlisted'] = self::countNumberOfWishedProducts($customer_node['id']);
            return $customer_node;
        },$customers_nodes);

        return array_filter($customers_with_account);
    }

    public static function buildGuestsData($guests_uuid){
        $guest_data = array_map(function($guest){
            $guest["displayName"] = self::$guest_label;
            $guest['number_wishlisted'] = self::countNumberOfWishedProducts($guest['id']);
            return $guest;
        }, $guests_uuid);

        return array_filter($guest_data, function($g) {return count($g) > 0;});
    }

    public static function countNumberOfWishedProducts($customer_id){
        return Wishlist::where('customer_id',$customer_id)->count();
    }


}
