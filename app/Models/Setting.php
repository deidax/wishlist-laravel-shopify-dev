<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;

class Setting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    protected $casts = [
        'button' => 'array'
    ];

    public function setButtonAttribute($value)
    {
        $result = array_filter($value, array(__CLASS__, 'buttonAttributeFilter'));
        $this->attributes['button'] = json_encode($result);
    }

    // Defining a callback function
    private static function buttonAttributeFilter($var){
        return ($var !== NULL && $var !== "");
    }

    /**
     * The params of the wishlist button.
     *
     * @return array
     */
    public static function setWishlistButtonParams(Request $request)
    {
        return 
        [
            'button' => $request->button,
            'innerHtml' => $request->innerHtml,
        ];
    }

    public static function getWishlistButtonParamsNames()
    {
        $empty_request = new Request();
        $fake_wishlist_settings = self::setWishlistButtonParams($empty_request);
        return array_keys($fake_wishlist_settings);
    }

    public static function checkIfThemeIsActive()
    {
        $shop = Auth::user();
        if($shop == null) return false;
        $shop_data = self::where("shop_id", $shop->name)->first();
        return $shop_data != null ? $shop_data->activated == 1 : false;
    }

    public static function getActiveThemeId($shop)
    {
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

        return $activeThemeId;

    }

    public static function ConfigureTheme(Request $request)
    {
        $shop = Auth::user();
        $activeThemeId = self::getActiveThemeId($shop);

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

        $shop_details = 
        [
            'shop_active_theme_id' => $activeThemeId,
            'shop_active_currency'=> $shop_active_currency,
            'activated' => true,
        ];

        // merge shop config with wishlist button params
        $shop_theme_configs = array_merge($shop_details, self::setWishlistButtonParams($request));

        // Save activated shop with wishlist button params
        return Setting::updateOrCreate(
        [
            'shop_id' => $shop->name
        ],
        $shop_theme_configs
        ) ?  ['message' => 'Theme setup successfully'] : ['message' => 'Theme setup error!'];
    }

    public static function getButtonParams(Request $request)
    {
        $buttonParams = self::where('shop_id', $request->shop_id)
                            ->where('shop_active_theme_id', $request->shop_active_theme_id)
                            ->first();

        if($buttonParams == null) return sendNotification('error','Please activate wishlist theme in app settings.');
            
        //return $buttonParams->only(self::getWishlistButtonParamsNames());
        $btn_params = $buttonParams->only(self::getWishlistButtonParamsNames());

        $btn_params['display_social_count'] = $btn_params['button']['display_social_count'];
        $btn_params['shop_domain'] = $request->shop_id;
        
        return $btn_params;

    }

    public static function getButtonParamsApp()
    {
        $shop_details = new Request();
        $shop = Auth::user();
        $shop_details->shop_id = $shop->name;
        $shop_details->shop_active_theme_id = self::getActiveThemeId($shop);
        
        return self::getButtonParams($shop_details);
    }
    
}
