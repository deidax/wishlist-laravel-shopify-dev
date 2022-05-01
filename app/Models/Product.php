<?php

namespace App\Models;

use App\Http\Resources\ProductResource;
use App\Traits\SortData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Auth;

class Product extends GraphQlBuilder
{
    use HasFactory, SortData;


    public static function writeQueryWithGids(){
        return "
            ...on Product{
              id
              title
              handle
              description
              totalInventory
              vendor
              variants(first: 15) {
                edges {
                  node {
                    id
                    sku
                  }
                }
              }
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
          $product_node['thumbnail'] = $product_node['images']['edges'] != null ? $product_node['images']['edges'][0]['node']['url'] : null;
          $product_node['number_of_customers'] = self::countNumberCustomers($product_node['id']);
          // $product_node['price_wishlisted'] = self::countCustomerWishlistedPrice($product_node['id']);
          return $product_node;
      },$products_nodes);
      return array_filter($products_data);
    }

    public static function countNumberCustomers($product_id){
        return Wishlist::where('product_id',$product_id)->count();
    }

    public static function getData()
    {
      $wishlist_ql = self::WishlistGraphQl("product_id", "Product");
      $wishlist = self::getDataOnly($wishlist_ql);

      $wishlist_data = ProductResource::collection($wishlist);

      return $wishlist_data;
    }

    

}
