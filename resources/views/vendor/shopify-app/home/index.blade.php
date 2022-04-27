@extends('shopify-app::layouts.default')

@section('styles')
    @include('shopify-app::partials.polaris_skeleton_css')
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
@endsection

@section('content')
    <div id="app">
        <navbar></navbar>
        <footerhelp></footerhelp>
    </div>
@endsection

@section('scripts')
    @parent
    <script src="{{ asset('js/app.js') }}" defer></script>
    @if(config('shopify-app.appbridge_enabled'))
        <script>
            actions.TitleBar.create(app, { title: 'Welcome' });
        </script>
    @endif
@endsection
