<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hospital;
use App\Models\HospitalPriority;
use App\Models\AuditLog; // TAMBAHKAN INI LID
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // TAMBAHKAN INI JUGA BIAR AMAN
class MappingController extends Controller
{
    // 1. Ambil SEMUA daftar RS buat dropdown dashboard
    public function index()
    {
        // Ambil semua RS, urutkan dari yang terbaru
        $hospitals = Hospital::latest()->get();
        return response()->json($hospitals);
    }

    // 2. Ambil DETAIL spesifik satu RS
    public function show($id)
    {
        $hospital = Hospital::findOrFail($id);
        return response()->json($hospital);
    }

    // 3. Simpan Mapping Baru (Sudah Oke)
   public function store(Request $request) 
    {
        $request->validate([
            'name' => 'required|string',
            'class' => 'required|string',
            'selectedPriorities' => 'required|array',
            'mappingData' => 'required|array'
        ]);

        $hospital = Hospital::create([
            'name' => $request->name,
            'class' => $request->class,
            'code' => strtoupper(substr($request->name, 0, 3)) . rand(100, 999)
        ]);

        foreach ($request->selectedPriorities as $categoryId) {
            HospitalPriority::create([
                'hospital_id' => $hospital->id,
                'category_id' => $categoryId,
                'target_strata' => $request->mappingData[$categoryId]
            ]);
        }

        // CATAT LOG MAPPING BARU
        AuditLog::create([
            'user_name' => Auth::user()->name ?? 'System',
            'action' => 'CREATE_MAPPING',
            'description' => "Berhasil mapping RS baru: " . $request->name . " (Kelas " . $request->class . ")",
            'ip_address' => $request->ip()
        ]);

        return response()->json([
            'message' => 'Mapping Berhasil!', 
            'hospital_id' => $hospital->id
        ]);
    }

    // 4. Ambil RS Aktif (Opsional buat fallback)
    public function getActiveHospital()
    {
        $hospital = Hospital::latest()->first();

        if (!$hospital) {
            return response()->json(['message' => 'Belum ada RS yang di-mapping'], 404);
        }

        $mappings = HospitalPriority::with('category')
            ->where('hospital_id', $hospital->id)
            ->get();

        return response()->json([
            'hospital' => $hospital,
            'mappings' => $mappings
        ]);
    }
}