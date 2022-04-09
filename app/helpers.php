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