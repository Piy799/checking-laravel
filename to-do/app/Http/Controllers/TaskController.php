<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // Fetch all tasks with optional search & sorting
    public function index(Request $request)
{
    $search = $request->query('search', '');
    $sortOrder = $request->query('sort', 'asc');
    $status = $request->query('status', 'all');

    $query = Task::where('title', 'like', "%$search%");

    // Filter by status
    if ($status === 'completed') {
        $query->where('completed', true);
    } elseif ($status === 'pending') {
        $query->where('completed', false);
    }

    $tasks = $query->orderBy('title', $sortOrder)->get();

    return response()->json($tasks);
}


    // Create a new task
    public function store(Request $request)
    {
        $request->validate(['title' => 'required|string|max:255']);

        $task = Task::create(['title' => $request->title]);

        return response()->json($task);
    }

    // Toggle task completion status
    public function update(Request $request, Task $task)
{
    $request->validate(['title' => 'required|string|max:255']);
    $task->update(['title' => $request->title]);
    

    return response()->json($task);
}

// New method to toggle task status
public function toggle(Task $task)
{
    $task->update(['completed' => !$task->completed]);

    return response()->json($task);
}


    // Delete a task
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(['message' => 'Task deleted']);
    }
}

