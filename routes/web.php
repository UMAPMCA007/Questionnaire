<?php
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Auth::routes();
Route::get('/', [App\Http\Controllers\Auth\LoginController::class, 'showLoginForm']);
Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('/assessment', [App\Http\Controllers\TestController::class, 'index'])->name('assessment');
Route::group(['middleware' => ['prevent-back-history']],function(){
    Route::get('/test/{session_id}/{session_name}/{i}', [App\Http\Controllers\TestController::class, 'test'])->name('test');  
});
Route::post('/store', [App\Http\Controllers\TestController::class, 'store'])->name('test.store');
Route::post('/submit', [App\Http\Controllers\TestController::class, 'submit'])->name('test.submit');