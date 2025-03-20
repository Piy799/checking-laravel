<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Http\Controllers\Controller;


class UserController extends Controller
{
    public function store(Request $request)
    {
        // Validate input
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
        ]);

        $name = $request->name;
        $email =$request->email;

        // Create user
        $user = new Admin();
        $user->name = $name;
        $user->email=$email;
        $user->save();
 


        return response()->json([
            'message' => 'User created successfully!',
            'user' => $user
        ], 201);
    }
}
