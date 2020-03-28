<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $table = 'books';
    protected $fillable = ['title', 'year', 'genre','author_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public function author()
    {
        return $this->belongsTo(Author::class);
    }
}
