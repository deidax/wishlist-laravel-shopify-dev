@extends('shopify-app::layouts.default')

@section('styles')
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="{{ mix('/css/app.css') }}" rel="stylesheet" />
  <script src="{{ mix('/js/manifest.js') }}" defer></script>
  <script src="{{ mix('/js/vendor.js') }}" defer></script>
  <script src="{{ mix('/js/app.js') }}" defer></script>
  @inertiaHead
@endsection

@section('content')
    <!-- You are: (shop domain name) -->
    @inertia
@endsection
