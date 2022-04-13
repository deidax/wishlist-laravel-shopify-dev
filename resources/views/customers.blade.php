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
  @if(count($customers_wishlist)>0)
    @include('partials.wishlist-customers', ['customers_wishlist' => $customers_wishlist])
  @else
    @include('partials.no-wishlist-products', ['text' => 'No customers yet'])
  @endif
</div>
  
@endsection
