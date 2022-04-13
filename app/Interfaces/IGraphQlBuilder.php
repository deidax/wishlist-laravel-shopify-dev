<?php

namespace App\Interfaces;


/*
|--------------------------------------------------------------------------
| GraphQl Interface
|--------------------------------------------------------------------------
|
| This interface will be used by GraphQlBuilder model
|
*/
interface IGraphQlBuilder{

    /**
     * return graphql query using gids array
     *
     * @return string
     */
    public static function writeQueryWithGids();

    /**
     * return graphql query using (first: 1)
     *
     * @return string
     */
    public static function writeQueryWithFirstOne();


}