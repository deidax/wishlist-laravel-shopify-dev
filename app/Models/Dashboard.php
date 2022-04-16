<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dashboard extends Model
{
    use HasFactory;

    public static function buildStatusInfo(){
        $data['todays_wishlist'] = Wishlist::getTodaysWishlist();
        $data['yesterday_wishlist'] = Wishlist::getYesterdaysWishlist();
        $data['total_wishlist'] = Wishlist::getTotalWishlist();

        return $data;
    }
}
