<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\v1\AuthorService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class AuthorController extends Controller
{
    protected $authorService;
    public function __construct(AuthorService $service)
    {
        $this->authorService = $service;
    }
    public function index()
    {
        $parameters = request()->input();
        $data = $this->authorService->getAllAuthors($parameters);
        return response()->json($data, 200);
        //
    }

    public function store(Request $request)
    {
        $validator = $this->authorService->validate($request->all());
        if (empty($validator)) {
            try {
                $book = $this->authorService->createAuthor($request);
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
        $data = $this->authorService->getAuthor($id);
        return response()->json($data, 200);
    }

    public function update(Request $request, $id)
    {
        $validator = $this->authorService->validate($request->all());
        if (empty($validator)) {
            try {
                $book = $this->authorService->updateAuthor($request, $id);
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
            $book = $this->authorService->deleteAuthor($id);
            return response()->make('', 204);
        } catch (ModelNotFoundException $ex) {
            throw $ex;
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }
}
