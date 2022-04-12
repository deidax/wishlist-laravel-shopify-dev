<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    public static function graphqlQuery($gids){
        return "
        {
            nodes(ids:$gids){
                ... on Customer {
                    id
                    displayName
                }
            }
          }";
        
    }
}
