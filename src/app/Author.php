<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    protected $table = 'authors';
    protected $fillable = ['first_name', 'last_name'];
    protected $hidden = ['created_at', 'updated_at'];
}
