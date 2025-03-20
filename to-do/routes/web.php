<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

// Serve React Frontend
Route::get('/', function () {
    return view('welcome'); 
});

// API Routes for Tasks
Route::prefix('api')->group(function () {
    Route::get('/tasks', [TaskController::class, 'index']);  // Fetch all tasks
    Route::post('/tasks', [TaskController::class, 'store']); // Create task
    Route::patch('/tasks/{task}', [TaskController::class, 'update']); // Toggle completion
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']); // Delete task
    Route::patch('/tasks/{task}/toggle', [TaskController::class, 'toggle']);

});
