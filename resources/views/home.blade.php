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
<div class="flex">
  <div class="px-10 mx-auto container align-middle">
      <div class="grid grid-cols-3 gap-6">
        <x-home.status type="positive" title="Today's wishlists" number="32" growth="9"/>
        <x-home.status type="negative" title="Yesterday's wishlists" number="20" growth="20"/>
        <x-home.status type="none" title="Total's wishlists" number="430" growth="9"/>
      </div>
  </div>
</div>
  
@endsection