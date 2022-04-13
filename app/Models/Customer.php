<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;


class Customer extends GraphQlBuilder
{
    use HasFactory;

    private static $guests_counter = 0;
    private static $customers_data = [];
    private static $customer_without_shopify_id = "Guest";



    //get the main data
    public static function getDataOnly($graphql){
        $customers = self::searchForGuests($graphql['body']->container['data']['nodes']);
        return $customers;
    }

    public static function writeQueryWithGids(){
        return "
        ... on Customer {
            displayName
        }
        ";
    }

    public static function writeQueryWithFirstOne(){
        return "no query yet";
    }

    public static function searchForGuests($customers_nodes){
        $displayNames = array_map(function($customer_node){
            if(is_null($customer_node)){
                $guest['displayName'] = self::$customer_without_shopify_id;
                return $guest;
            }
            return $customer_node;
        },$customers_nodes);

        array_walk($displayNames, [__CLASS__, "guestCounting"]);

        return self::$customers_data;
            
    }

    public static function guestCounting($value){
        if($value['displayName'] == self::$customer_without_shopify_id){
            self::$guests_counter++;
            $value['displayName'] = $value['displayName']." ".self::$guests_counter;
        }

        array_push(self::$customers_data, $value);
    }

}
