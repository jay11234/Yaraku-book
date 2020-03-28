<?php

namespace App\Providers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Exists;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend('foreign_key', function ($attribute, $value, $parameters, $validator) {
            $instance = is_string($parameters[0]) ? new $parameters[0] : $parameters[0];

            return new Exists($instance->getTable(), $instance->getKeyName());
        });
    }
}
