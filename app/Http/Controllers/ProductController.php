<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(string $orderBy = '', int $number = null)
    {

        return Product::sortData('number_of_customers', $orderBy, $number);

    }
}
