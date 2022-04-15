<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Auth;

if(! function_exists('getSettings')){

    function getSettings()
    {
        $shop = Auth::user();
        return Setting::where("shop_id", $shop->name)->first();
    }

}

if(! function_exists('sendNotification')){

    function sendNotification(string $type, string $message)
    {
        return [
            'type' => $type,
            'message' => $message
        ];
    }

}

if(! function_exists('getCurrency')){

    function getCurrency()
    {
        $shop = Auth::user();

        $shop_data = $shop->api()->rest('GET', '/admin/api/2022-04/shop.json');
                
        $shop_active_currency = $shop_data['body']->shop->currency;

        return $shop_active_currency;
    }

}