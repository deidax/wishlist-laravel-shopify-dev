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

    

}
