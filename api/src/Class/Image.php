<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = ['produit_id', 'url'];

    public function Product()
    {
        return $this->belongsTo(\Product::class);
    }
}
