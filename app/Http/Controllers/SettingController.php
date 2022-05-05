<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Annotations as OA;

class SettingController extends Controller
{   


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function show(Setting $setting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function edit(Setting $setting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Setting $setting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function destroy(Setting $setting)
    {
        //
    }

    /**
     * Configure Shopify Theme
     *
     * @return \Illuminate\Http\Response
     */
    public function ConfigureTheme(Request $request)
    {   
        return Setting::ConfigureTheme($request);
    }

    //return true or false

    public function isThemeActivated()
    {
        $api_data['is_activated'] = Setting::checkIfThemeIsActive();

        return $api_data;
    }

    public function getStoreThemes()
    {
        $shop = Auth::user();
        $themes = $shop->api()->rest('GET', '/admin/api/2022-04/themes.json');

        return $themes['body']['themes'];
    }

    public function getButtonParams(Request $request)
    {
        return Setting::getButtonParams($request);
    }

    public function getButtonParamsApp()
    {
        return Setting::getButtonParamsApp();
    }
}
