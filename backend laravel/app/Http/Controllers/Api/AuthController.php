<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\AuditLog; // TAMBAHKAN INI

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Login gagal!'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        
        // CATAT LOG LOGIN
        AuditLog::create([
            'user_name' => $user->name,
            'action' => 'LOGIN',
            'description' => "User " . $user->name . " masuk ke sistem",
            'ip_address' => $request->ip()
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role
            ]
        ]);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required'
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'role' => $data['role']
        ]);

        // CATAT LOG REGISTER
        AuditLog::create([
            'user_name' => Auth::user()->name ?? 'System',
            'action' => 'REGISTER_USER',
            'description' => "Menambahkan user baru: " . $data['name'] . " (" . $data['role'] . ")",
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'User berhasil ditambahkan!', 'user' => $user]);
    }

    public function updateRole(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $oldRole = $user->role;
        $user->update(['role' => $request->role]);

        // CATAT LOG UPDATE ROLE
        AuditLog::create([
            'user_name' => Auth::user()->name ?? 'System',
            'action' => 'UPDATE_ROLE',
            'description' => "Mengubah role user " . $user->name . " dari " . $oldRole . " ke " . $request->role,
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Role berhasil diupdate!']);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->id === Auth::id()) {
            return response()->json(['message' => 'Gak bisa hapus akun sendiri, Lid!'], 403);
        }
        
        $userName = $user->name;
        $user->delete();

        // CATAT LOG HAPUS USER
        AuditLog::create([
            'user_name' => Auth::user()->name ?? 'System',
            'action' => 'DELETE_USER',
            'description' => "Menghapus user: " . $userName,
            'ip_address' => request()->ip()
        ]);

        return response()->json(['message' => 'User dihapus!']);
    }
}