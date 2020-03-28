<?php

namespace App\Providers\v1;

use Illuminate\Support\ServiceProvider;
use App\Services\v1\AuthorService;

class AuthorServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            AuthorService::class,
            function ($app) {
                return new AuthorService();
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
