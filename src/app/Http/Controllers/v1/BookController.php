<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\v1\BookService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;
use Validator;

class BookController extends Controller
{

    protected $bookService;
    public function __construct(BookService $service)
    {
        $this->bookService = $service;
    }
    public function index()
    {
        $parameters = request()->input();
        $data = $this->bookService->getAllBooks($parameters);
        return response()->json($data, 200);
        //
    }

    public function store(Request $request)
    {
        $validator = $this->bookService->validate($request->all());
        if (empty($validator)) {
            try {
                $book = $this->bookService->createBook($request);
                return response()->json($book, 201);
            } catch (Exception $e) {
                return response()->json(['message' => $e->getMessage()], 500);
            }
        } else {
            return response()->json($validator, 422);
        }
    }

    public function show($id)
    {
        $data = $this->bookService->getBook($id);
        return response()->json($data, 200);
    }

    public function update(Request $request, $id)
    {
        $validator = $this->bookService->validate($request->all());
        if (empty($validator)) {
            try {
                $book = $this->bookService->updateBook($request, $id);
                return response()->json($book, 200);
            } catch (ModelNotFoundException $ex) {
                throw $ex;
            } catch (Exception $e) {
                return response()->json(['message' => $e->getMessage()], 500);
            }
        } else {
            return response()->json($validator, 422);
        }
    }


    public function destroy($id)
    {
        try {
            $book = $this->bookService->deleteBook($id);
            return response()->make('', 204);
        } catch (ModelNotFoundException $ex) {
            throw $ex;
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }
}
