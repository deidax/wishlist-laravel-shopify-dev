<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Annotations as OA;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        //eturn parent::toArray($request);
        return [
            "id" => $this['id'],
            "title" => $this['title'],
            "handle" => $this['handle'],
            "description" => $this['description'],
            "totalInventory" => $this['totalInventory'],
            "variants" => $this['variants'],
            "createdAt" => $this['createdAt'],
            "images" => $this['images'],
            "priceRangeV2" => $this['priceRangeV2'],
            "number_of_customers" => $this['number_of_customers']
            
        ];
    }
}