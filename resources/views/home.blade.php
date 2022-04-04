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
@include('partials.activate-model')
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

@section('scripts')
    @parent

    <script>
      // Event to close the activate model
      let event = new CustomEvent("activate-model-load", {
        detail: {
          open: false
        }
      });

      function initActivationModel(){
        this.progress = false,
        window.dispatchEvent(event)
      }

      function activateModelComponent(){
        return {
            open: true,
            progress: false,
            setupTheme(){
              this.progress = true,
              // execute the api
              axios.post('/configure-theme')
                .then(function (response) {
                  initActivationModel();
                  console.log(response);
              })
                .catch(function (error) {
                  initActivationModel();
                  console.log(error);
              });
            }
        }
      }

     
     
      
    </script>

@endsection