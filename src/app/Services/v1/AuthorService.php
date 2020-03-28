<?php

namespace App\Services\v1;

use Illuminate\Support\Facades\Validator;
use App\Book;
use App\Author;
use Illuminate\Auth\Events\Validated;


class AuthorService
{
    #title, authorid, genre, published_year
    #first)name, last_name, 
    protected $rules = [
        'first_name' => 'required|string|max:100',
        'last_name' => 'required|string|max:100',  
    ];

    public function validate($author)
    {
        $validator = Validator::make($author, $this->rules);
        if ($validator->fails()) {
            return $validator->errors();
        }
        return [];
    }
    public function getAuthor($id)
    {
        if (Author::find($id) == null) {
            $error = ['message' => 'Author has not found'];
            return $error;
        } else {
            $author = Author::find($id);
            return $author;
        }
    }
    
    public function getAllAuthors()
    {
        return Author::all();
    }
    public function createAuthor($req)
    {
        $author = new Author();
        $author->first_name = $req->input('first_name');
        $author->last_name = $req->input('last_name');     
        $author->save();
        return $author;
    }
    public function updateAuthor($req, $id)
    {
        $author = Author::where('id', $id)->firstOrFail();
        $author->first_name = $req->input('first_name');
        $author->last_name = $req->input('last_name');     
        $author->save();
        return $author;
    }
    public function deleteAuthor($id)
    {
        $author = Author::find($id);
        $author->delete();
    }
}
