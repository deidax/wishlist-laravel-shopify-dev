<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('shop_id')->unique();
            $table->string('shop_active_theme_id');
            $table->string('shop_active_currency');
            $table->boolean('activated')->default(false);
            $table->boolean('display_social_count')->default(false);
            $table->enum('button_type', ['text', 'icon', 'text_icon'])->default('text');
            $table->enum('button_icon', ['like', 'star', 'heart'])->default('heart');;
            $table->string('btn_label_before')->default('Add to wishlist');
            $table->string('btn_label_after')->default('Added to wishlist');
            //colors
            $table->string('bg_color_before')->default('#B1B1B1');
            $table->string('bg_color_after')->default('#FFFFFF');
            $table->string('text_color_before')->default('#B1B1B1');
            $table->string('text_color_after')->default('#FFFFFF');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('settings');
    }
}
