<div class="bg-50">
	<div class="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
		<div class="mt-8 flex justify-between">

			<div class="">
				<h4 class="text-xl leading-6 font-medium text-gray-900">Customers wishlisted</h4>
				<p class="mt-2 text-sm leading-6 text-gray-600">
				  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.
				</p>
			</div>

			<div class="w-56">
				@include('partials.customers-svg')
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
			  <th class="px-4 py-3">Customer Name</th>
			  <th class="px-4 py-3">Number of products</th>
			  <th class="px-4 py-3">Wishlist cost</th>
			</tr>
		  </thead>
		  <tbody class="bg-white">
			@foreach ($customers_wishlist as $customer)
				<tr class="text-gray-700">
					<td class="px-4 py-3 text-ms font-semibold border">{{$customer['displayName']}}</td>
					<td class="px-4 py-3 text-xs border">
						<span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> 
							--
						</span>
					</td>
					<td class="px-4 py-3 text-ms font-semibold border">--</td>
				</tr>
			@endforeach
		  </tbody>
		</table>
	  </div>
	</div>