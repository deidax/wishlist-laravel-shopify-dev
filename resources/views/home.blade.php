@extends('partials.main')

@section('page-content')

{{-- The getSettings function is in App\helpers.php --}}
@if (!getSettings() || !getSettings()->activated)
  @include('partials.activate-model')
@endif

<div class="flex">
  <div class="px-10 mx-auto container align-middle">
    {{-- @if (getSettings() && getSettings()->activated)
    @endif --}}
  @if (!getSettings() || !getSettings()->activated)
    @include('partials.app-activated-alert')
    @include('partials.error-app-activated-alert')
  @endif
      <div class="grid grid-cols-3 gap-6 my-5">
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
          open: false,
        }
      });

      let activation = new CustomEvent("activation-message", {
        detail: {
          open_activation_alert: true
        }
      });

      let activation_error = new CustomEvent("activation-message-error", {
        detail: {
          open_activation_error_alert: true
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
                  window.dispatchEvent(activation)
                  console.log(response);
              })
                .catch(function (error) {
                  initActivationModel();
                  window.dispatchEvent(activation_error)
                  console.log(error);
              });
            }
        }
      }

      	
      function activationModal() {
          return {
              open_activation_alert: false,
              init() {
                  window.addEventListener("activation-message", (event) => {
                      this.showMessage(event.detail.open_activation_alert);
                  });
              },
              showMessage(open) {
                  this.open_activation_alert = open;
                  // window.setTimeout(() => {
                  //     this.open_activation_alert = false;
                  // }, 3000);
              }
          }
      }

      function activationErrorModal() {
          return {
              open_activation_error_alert: false,
              init() {
                  window.addEventListener("activation-message-error", (event) => {
                      this.showMessage(event.detail.open_activation_error_alert);
                  });
              },
              showMessage(open) {
                  this.open_activation_error_alert = open;
                  // window.setTimeout(() => {
                  //     this.open_activation_error_alert = false;
                  // }, 3000);
              }
          }
      }

      

     
     
      
    </script>

@endsection