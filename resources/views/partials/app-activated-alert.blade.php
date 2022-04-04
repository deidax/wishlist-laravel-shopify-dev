<div x-data="{ open_activation_alert: {{ getSettings() != null ? getSettings()->activated : false }} }" x-show="open_activation_alert" x-on:activate-model-success.window="open_activation_alert = $activate_success_event.detail.open_activation_alert" class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
  <div class="flex">
    <div class="py-1 mr-5">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20" version="1.1">
        <g id="surface1">
        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(14.509804%,68.235294%,53.333333%);fill-opacity:1;" d="M 20 10 C 20 15.523438 15.523438 20 10 20 C 4.476562 20 0 15.523438 0 10 C 0 4.476562 4.476562 0 10 0 C 15.523438 0 20 4.476562 20 10 Z M 20 10 "/>
        <path style="fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke:rgb(100%,100%,100%);stroke-opacity:1;stroke-miterlimit:10;" d="M 37.998047 15 L 22.001953 32.998047 L 12.001953 25 " transform="matrix(0.4,0,0,0.4,0,0)"/>
        </g>
        </svg>
    </div>
    <div>
      <p class="font-bold">App settings have been updated successfully!</p>
      <p class="text-sm">The configuration settings is now active</p>
    </div>
  </div>
</div>