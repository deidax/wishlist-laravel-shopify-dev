<!-- component -->
	<div class="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
	  <div class="w-full overflow-x-auto">
		<table class="w-full">
		  <thead>
			<tr class="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
			  <th class="px-4 py-3">Title</th>
			  <th class="px-4 py-3">Description</th>
			  <th class="px-4 py-3">Price</th>
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
							<p class="text-xs text-gray-600">{{$product['id']}}</p>
						</div>
						</div>
					</td>
					<td class="px-4 py-3 text-ms font-semibold border">{{$product['description']}}</td>
					<td class="px-4 py-3 text-xs border">
						<span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> 
							{{$product['priceRangeV2']['maxVariantPrice']['amount']}} {{$product['priceRangeV2']['maxVariantPrice']['currencyCode']}} 
						</span>
					</td>
					<td class="px-4 py-3 text-sm border">{{$product['createdAt']}}</td>
				</tr>
			@endforeach
		  </tbody>
		</table>
	  </div>
	</div>