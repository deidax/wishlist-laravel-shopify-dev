<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Setting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    public static function checkIfThemeIsActive()
    {
        $shop = Auth::user();
        $shop_data = self::where("shop_id", $shop->name)->first();
        return $shop_data != null ? $shop_data->activated == 1 : false;
    }

    public static function ConfigureTheme(Request $request)
    {
        $shop = Auth::user();
        $themes = $shop->api()->rest('GET', '/admin/api/2022-04/themes.json');

        $shopThemes = $themes['body']['themes'];

        $searchedThemeRole = "main";

        //search for the right theme id with the main role
        $activeTheme = array_filter(
            $shopThemes->toArray(),
            function ($e) use (&$searchedThemeRole) {
                return $e['role'] == $searchedThemeRole;
            }
        );

        $activeThemeId = $activeTheme[0]['id'];

        $snippet = "Your snippet code updated 3";

        //Snippet to pass to rest api request
        $data = array(
            'asset'=> [
                'key' => 'snippets/deidax-wishlist-app-laravel.liquid', 
                'value' => $snippet
            ]
        );

        $shop->api()->rest('PUT', '/admin/api/2022-04/themes/'.$activeThemeId.'/assets.json', $data);

        // get shop active currency

        $shop_data = $shop->api()->rest('GET', '/admin/api/2022-04/shop.json');
        
        $shop_active_currency = $shop_data['body']->shop->currency;

        // Save activated shop
        return Setting::updateOrCreate(
        [
            'shop_id' => $shop->name
        ],
        [
            'shop_active_theme_id' => $activeThemeId,
            'shop_active_currency'=> $shop_active_currency,
            'activated' => true,
            'display_social_count' => $request->display_social_count,
            'button_type' => $request->button_type,
            'button_icon' => $request->button_icon,
            'btn_label_before' => $request->btn_label_before,
            'btn_label_after' => $request->btn_label_after,
            'bg_color_before' => $request->bg_color_before,
            'bg_color_after' => $request->bg_color_after,
            'text_color_before' => $request->text_color_before,
            'text_color_after' => $request->text_color_after,
        ]) ?  ['message' => 'Theme setup successfully'] : ['message' => 'Theme setup error!'];
    }
}
