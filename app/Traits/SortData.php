<?php

namespace App\Traits;

/*
|--------------------------------------------------------------------------
| Sort Data Trait
|--------------------------------------------------------------------------
|
| This class will be used to make it easy to use graphql
|
*/
trait SortData {

    /**
     * Sort Data to display to user in front-end
     *
     * @param  string  $sortBy the name of the field to sort by
     * @param  string  $orderBy DESC or ASC
     * @param  int  $number the number of data to return
     * @return array
     */
    public static function sortData(string $sortBy = '', string $orderBy = '', int $number = null)
    {
        //sort
        $data = self::getData();
        if($sortBy != '' && $orderBy != '' && !is_null($number))
        {
            $orderBy == "DESC" ?  $sorted_data = $data->sortByDesc($sortBy)->values() : $sorted_data = $data->sortBy($sortBy)->values();
            return $sorted_data->slice(0, $number);
        }

        return $data->slice(0, $number);
    }
}