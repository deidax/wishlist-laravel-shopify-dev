@extends('shopify-app::layouts.default')

@section('styles')
<script src="https://cdn.tailwindcss.com"></script>
@endsection

@section('content')
    @inertia
@endsection

@section('scripts')
    @parent
    <link href="{{ mix('/css/app.css') }}" rel="stylesheet" />
    <script src="{{ mix('/js/manifest.js') }}" defer></script>
    <script src="{{ mix('/js/vendor.js') }}" defer></script>
    <script src="{{ mix('/js/app.js') }}" defer></script>
    @if(config('shopify-app.appbridge_enabled'))
        <script>
            actions.TitleBar.create(app, { title: 'Welcome' });
        </script>
    @endif
    @inertiaHead
@endsection