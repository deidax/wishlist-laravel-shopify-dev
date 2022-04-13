@extends('partials.main')

@section('page-content')
    <!-- You are: (shop domain name) -->
    {{-- <p>You are: {{ $shopDomain ?? Auth::user()->name }}</p> --}}
    <!-- This example requires Tailwind CSS v2.0+ -->
<!--
  This example requires updating your template:

  ```
  <html class="h-full bg-gray-100">
  <body class="h-full">
  ```
-->
<div class="min-h-full">
  @if(count($wishlist)>0)
    @include('partials.wishlist-products', ['wishlist' => $wishlist])
  @else
    @include('partials.no-wishlist-products', ['text' => 'No Products in wishlist'])
  @endif
</div>
  
@endsection