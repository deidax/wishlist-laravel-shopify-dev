<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SwaggerController extends Controller
{
    /**
     * Display Swagger page
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('swagger');   
    }
}
