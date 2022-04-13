<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;


class Customer extends GraphQlBuilder
{
    use HasFactory;

    

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
}
