@extends('shopify-app::layouts.default')

@section('content')
    <div id="app">
        <navbar></navbar>
        <footerhelp></footerhelp>
    </div>
@endsection

@section('script')
    window.csrf_token = "{{ csrf_token() }}"
@endsection
