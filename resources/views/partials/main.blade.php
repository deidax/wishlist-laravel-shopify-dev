@extends('shopify-app::layouts.default')

@section('content')
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
    
    @include('partials.page-title', ['title' =>  ucfirst(trans(Route::current()->getName())) ])
    
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Replace with your content -->
        <div id="wrapper" class="container px-4 py-4 mx-auto">
          @yield('page-content')
        </div>
        <!-- /End replace -->
      </div>
    
  
@endsection

@section('scripts')
    @parent

    <script>
        actions.TitleBar.create(app, { title: '{{ucfirst(trans(Route::current()->getName()))}}' });
    </script>
@endsection