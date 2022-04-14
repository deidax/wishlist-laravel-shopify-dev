<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Auth;

class Product extends GraphQlBuilder
{
    use HasFactory;


    public static function writeQueryWithGids(){
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

    public static function writeQueryWithFirstOne(){
      return "no query yet";
    }

    //get the main data
    public static function getDataOnly($graphql){
      $products_data = self::buildProductsData($graphql['body']->container['data']['nodes']);
      
      return $products_data;
    }



    public static function buildProductsData($products_nodes){
      // customers with account
      $products_data = array_map(function($product_node){
          $product_node['id'] = self::getNumericShopifyQl("Product",$product_node['id']);
          $product_node['number_of_customers'] = self::countNumberCustomers($product_node['id']);
          // $product_node['price_wishlisted'] = self::countCustomerWishlistedPrice($product_node['id']);
          return $product_node;
      },$products_nodes);

      return array_filter($products_data);
    }

    public static function countNumberCustomers($product_id){
        return Wishlist::where('product_id',$product_id)->count();
    }

    

}
