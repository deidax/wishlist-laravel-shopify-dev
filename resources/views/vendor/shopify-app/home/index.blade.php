@extends('shopify-app::layouts.default')

@section('styles')
    <link href="{{ mix('css/app.css') }}" type="text/css" rel="stylesheet"/>
@endsection

@section('content')
    <div id="app">
        <navbar></navbar>
        <footerhelp></footerhelp>
    </div>
@endsection

@section('scripts')
    @parent
    <script src="{{ mix('js/app.js') }}" type="text/javascript"></script>
    @if(config('shopify-app.appbridge_enabled'))
        <script>
            actions.TitleBar.create(app, { title: 'Welcome' });
        </script>
    @endif
@endsection
