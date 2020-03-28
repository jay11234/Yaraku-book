<?php

namespace App\Services\v1;

use Illuminate\Support\Facades\Validator;
use App\Book;
use App\Author;
use Illuminate\Auth\Events\Validated;


class BookService
{
    #title, authorid, genre, published_year
    #first)name, last_name, 
    protected $rules = [
        'title' => 'required|string|max:100',
        'genre' => 'null|string|max:100',
        'author_id' => 'foreign_key:' . Author::class,
        'published_year' => 'required|integer|digits:4|min:1800',
    ];

    public function validate($book)
    {
        $validator = Validator::make($book, $this->rules);
        if ($validator->fails()) {
            return $validator->errors();
        }
        return [];
    }
    public function getBook($id)
    {
        if (Book::find($id) == null) {
            $error = ['message' => 'Book has not found'];
            return $error;
        } else {
            $book = Book::find($id);
            return $book;
        }
    }
    public function getBookByAuthor($author_id)
    {
        if (Author::find($author_id)) {
            $error = ['message' => 'Author has not found'];
            return $error;
        } else {
            $books = Book::where('author_id', $author_id)->get();
            return $books;
        }
    }
    public function getAllBooks()
    {
        return Book::all();
    }
    public function createBook($req)
    {
        $book = new Book();
        $book->title = $req->input('title');
        $book->author_id = $req->input('author_id');
        $book->genre = $req->input('genre');
        $book->published_year = $req->input('published_year');
        $book->save();
        return $book;
    }
    public function updateBook($req, $id)
    {
        $book = Book::where('id', $id)->firstOrFail();
        $book->title = $req->input('title');
        $book->author_id = $req->input('author_id');
        $book->genre = $req->input('genre');
        $book->published_year = $req->input('published_year');
        $book->save();
        return $book;
    }
    public function deleteBook($id)
    {
        $book = Book::find($id);
        $book->delete();
    }
}
