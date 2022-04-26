<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Setting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'shop_id',
        'shop_active_theme_id',
        'shop_active_currency',
        'activated'
    ];

    public static function checkIfThemeIsActive()
    {
        $shop = Auth::user();
        $shop_data = self::where("shop_id", $shop->name)->first();
        return $shop_data != null ? $shop_data->activated == 1 : false;
    }
}
