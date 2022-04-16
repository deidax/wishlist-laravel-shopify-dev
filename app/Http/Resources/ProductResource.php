<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Annotations as OA;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        
        return parent::toArray($request);
    }
}