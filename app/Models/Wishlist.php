<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'shop_id',
        'product_id',
        'product_price',
        'customer_id',
    ];


    public static function getTodaysWishlist(){
        return self::whereDate('updated_at', Carbon::today())->count();
    }

    public static function getYesterdaysWishlist(){
        return self::whereDate('updated_at', Carbon::yesterday())->count();
    }

    public static function getTotalWishlist(){
        return self::all()->count();
    }
}
