<!-- status card -->
<div class="shadow rounded-lg py-3 px-5 bg-white">
    <div class="flex flex-row justify-between items-center">
    <div>
        <h6 class="text-2xl">{{$title}}</h6>
        <h4 class="text-black text-4xl font-bold text-left">{{$number}}</h4>
    </div>
    <div>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="#14B8A6"
        stroke-width="2"
        >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
        </svg>
    </div>
    </div>
    <div>
        <p class="flex items-center justify-end @if($type == 'negative') text-red-500 @elseif($type =='positive') text-green-500 @else text-gray-500 @endif text-md">
            @if($type == 'negative')
                <span class="text-red-600 font-bold">{{$growth}}%</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path class="heroicon-ui" d="M20 9a1 1 0 012 0v8a1 1 0 01-1 1h-8a1 1 0 010-2h5.59L13 10.41l-3.3 3.3a1 1 0 01-1.4 0l-6-6a1 1 0 011.4-1.42L9 11.6l3.3-3.3a1 1 0 011.4 0l6.3 6.3V9z"/></svg>
            @elseif($type =='positive')
                <span class="text-teal-500 font-bold">{{$growth}}%</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current" stroke-width="0.5" stroke="#14B8A6" viewBox="0 0 24 24"><path class="heroicon-ui" d="M20 15a1 1 0 002 0V7a1 1 0 00-1-1h-8a1 1 0 000 2h5.59L13 13.59l-3.3-3.3a1 1 0 00-1.4 0l-6 6a1 1 0 001.4 1.42L9 12.4l3.3 3.3a1 1 0 001.4 0L20 9.4V15z"/></svg>
            @else
                <span class="text-teal-500 font-bold">{{$growth}}%</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path class="heroicon-ui" d="M17 11a1 1 0 010 2H7a1 1 0 010-2h10z"/></svg>
            @endif
        </p>
    </div>
</div>
            