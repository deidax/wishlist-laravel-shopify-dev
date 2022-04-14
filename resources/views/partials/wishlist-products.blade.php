<div class="bg-50">
	<div class="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
		<div class="mt-8 flex justify-between">

			<div class="">
				<h4 class="text-xl leading-6 font-medium text-gray-900">Products wishlisted</h4>
				<p class="mt-2 text-sm leading-6 text-gray-600">
				  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.
				</p>
			</div>

			<div class="w-56">
				@include('partials.wishlist-svg')
			</div>

		</div>


	</div>
  </div>
<!-- component -->
	<div class="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
	  <div class="w-full overflow-x-auto">
		<table class="w-full">
		  <thead>
			<tr class="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
			  <th class="px-4 py-3">Title</th>
			  <th class="px-4 py-3">Description</th>
			  <th class="px-4 py-3">Total customers</th>
			  <th class="px-4 py-3">Price</th>
			  <th class="px-4 py-3">Inventory</th>
			  <th class="px-4 py-3">Added at</th>
			</tr>
		  </thead>
		  <tbody class="bg-white">
			@foreach ($wishlist as $product)
				<tr class="text-gray-700">
					<td class="px-4 py-3 border">
						<div class="flex items-center text-sm">
						<div class="relative w-8 h-8 mr-3 rounded-full md:block">
							@if(count($product['images']['edges']) > 0)
								<img class="object-cover w-full h-full rounded-full" src="{{$product['images']['edges'][0]['node']['url']}}" alt="" loading="lazy" />
							@else
								<img class="object-cover w-full h-full rounded-full" src="https://www.opelgtsource.com/assets/default_product.png" alt="" loading="lazy" />
							@endif
								<div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
						</div>
						<div>
							<p class="font-semibold text-black">{{$product['title']}}</p>
							<p class="text-xs text-gray-600">id: {{$product['id']}}</p>
						</div>
						</div>
					</td>
					<td class="px-4 py-3 text-ms font-semibold border">{{ Str::limit($product['description'], 20) }}</td>
					<td class="px-4 py-3 text-ms font-semibold border">{{ $product['number_of_customers'] }}</td>
					<td class="px-4 py-3 text-xs border">
						<span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> 
							{{$product['priceRangeV2']['maxVariantPrice']['amount']}} {{$product['priceRangeV2']['maxVariantPrice']['currencyCode']}} 
						</span>
					</td>
					<td class="px-4 py-3 text-ms font-semibold border">{{$product['totalInventory']}}</td>
					<td class="px-4 py-3 text-sm border">{{$product['createdAt']}}</td>
				</tr>
			@endforeach
		  </tbody>
		</table>
	  </div>
	</div>