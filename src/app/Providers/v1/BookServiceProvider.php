<?php

namespace App\Providers\v1;

use Illuminate\Support\ServiceProvider;
use PhpParser\Node\Stmt\UseUse;
use App\Services\v1\BookService;
 

class BookServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            BookService::class,
            function ($app) {
                return new BookService();
            }

        );
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
