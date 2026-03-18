<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Question;
use App\Models\HospitalPriority;
use App\Models\Assessment;
use App\Models\AuditLog; // TAMBAHKAN INI LID
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // TAMBAHKAN INI JUGA BIAR AMAN

class AssessmentController extends Controller
{
    public function getCategories()
    {
        return response()->json(Category::all());
    }

    public function saveScore(Request $request)
    {
        $request->validate([
            'hospital_id' => 'required|exists:hospitals,id',
            'question_id' => 'required|exists:questions,id',
            'score'       => 'required|numeric|min:0|max:10',
        ]);

        $assessment = Assessment::updateOrCreate(
            ['hospital_id' => $request->hospital_id, 'question_id' => $request->question_id],
            ['score' => $request->score]
        );
        $hospital = \App\Models\Hospital::find($request->hospital_id);
        $question = \App\Models\Question::find($request->question_id);

        AuditLog::create([
            'user_name' => Auth::user()->name ?? 'System',
            'action' => 'SAVE_SCORE',
            'description' => "Update skor RS " . ($hospital->name ?? 'Unknown') . " pada indikator ID: " . $question->id . " menjadi " . $request->score,
            'ip_address' => $request->ip()
        ]);
        return response()->json(['message' => 'Skor berhasil disimpan!', 'data' => $assessment]);
    }

    public function getDashboardData(Request $request) 
    {
        $hospitalId = $request->query('hospital_id');
        $mappings = HospitalPriority::where('hospital_id', $hospitalId)->get();

        return Category::whereIn('id', $mappings->pluck('category_id'))->get()->map(function($cat) use ($mappings, $hospitalId) {
            $mappingInfo = $mappings->where('category_id', $cat->id)->first();
            $strata = $mappingInfo->target_strata; 
            
            $questions = Question::where('category_id', $cat->id)
                ->where('is_' . strtolower($strata), true)
                ->get();

            $cat->questions = $questions->map(function($q) use ($hospitalId) {
                $savedScore = Assessment::where('hospital_id', $hospitalId)->where('question_id', $q->id)->first();
                $q->score = $savedScore ? $savedScore->score : 0;
                return $q;
            });

            $cat->target_strata = $strata;
            return $cat;
        });
    }

    // Ambil daftar soal buat Master Indikator
    public function getQuestionsByCategory(Request $request) {
        return Question::where('category_id', $request->category_id)->get();
    }

    // Update strata via checkbox
    public function updateStrata(Request $request, $id) {
        $q = Question::findOrFail($id);
        $q->update($request->only(['is_paripurna', 'is_utama', 'is_madya', 'is_dasar']));
        return response()->json(['message' => 'Strata Updated']);
    }

    // FUNGSI BARU: Simpan Indikator Baru dari Modal Frontend
    public function storeQuestion(Request $request) {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'section'     => 'required|string',
            'indicator'   => 'required|string',
            'is_paripurna'=> 'boolean',
            'is_utama'    => 'boolean',
            'is_madya'    => 'boolean',
            'is_dasar'    => 'boolean',
        ]);

        $question = Question::create($validated);

        // PERBAIKAN DI SINI LID
        AuditLog::create([
            'user_name' => Auth::user() ? Auth::user()->name : 'System',
            'action' => 'CREATE_INDICATOR',
            'description' => "Menambahkan indikator baru: " . $request->indicator,
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Indikator Berhasil Ditambah!', 'data' => $question]);
    }
    public function destroyQuestion($id) {
        $question = Question::findOrFail($id);
        $question->delete();
        
        return response()->json(['message' => 'Indikator berhasil dihapus!']);
    }
    public function updateQuestion(Request $request, $id) {
    $q = Question::findOrFail($id);
    $q->update($request->all());
    return response()->json(['message' => 'Indikator berhasil diupdate!']);
    }
    // Tambahkan di bagian paling bawah class AssessmentController
public function getAllReports()
{
    // Kita ambil semua Hospital yang sudah punya Mapping Priority
    $reports = \App\Models\Hospital::with(['priorities.category'])->get()->map(function($hospital) {
        return $hospital->priorities->map(function($priority) use ($hospital) {
            $catId = $priority->category_id;
            $strata = strtolower($priority->target_strata);

            // Hitung total indikator di kategori & strata tersebut
            $totalQuestions = \App\Models\Question::where('category_id', $catId)
                ->where('is_' . $strata, true)
                ->count();

            // Hitung total skor yang sudah diisi (asumsi 1 soal max 10 poin)
            $currentScore = \App\Models\Assessment::where('hospital_id', $hospital->id)
                ->whereIn('question_id', function($query) use ($catId, $strata) {
                    $query->select('id')->from('questions')
                        ->where('category_id', $catId)
                        ->where('is_' . $strata, true);
                })->sum('score');

            // Hitung Persentase
            $maxScore = $totalQuestions * 10;
            $percentage = $maxScore > 0 ? round(($currentScore / $maxScore) * 100, 1) : 0;

           return [
                'id' => $hospital->id . '-' . $catId,
                'hospital_id' => $hospital->id, // TAMBAHKAN INI LID
                'hospital_name' => $hospital->name,
                'category' => $priority->category->name,
                'score' => $percentage,
                'strata' => strtoupper($strata),
                'date' => $hospital->created_at->format('d M Y')
            ];
        });
    })->flatten(1);

    return response()->json($reports);
}
// Tambahkan di AssessmentController.php
public function getRadarData(Request $request)
{
    $hospitalId = $request->query('hospital_id');
    
    // Ambil semua kategori
    $categories = \App\Models\Category::all();
    
    $labels = [];
    $scores = [];

    foreach ($categories as $cat) {
        $labels[] = $cat->name;
        
        // Cari mapping strata RS untuk kategori ini
        $mapping = \App\Models\HospitalPriority::where('hospital_id', $hospitalId)
            ->where('category_id', $cat->id)
            ->first();

        if ($mapping) {
            $strata = strtolower($mapping->target_strata);
            
            // Hitung skor seperti logika laporan tadi
            $totalQuestions = \App\Models\Question::where('category_id', $cat->id)
                ->where('is_' . $strata, true)
                ->count();

            $currentScore = \App\Models\Assessment::where('hospital_id', $hospitalId)
                ->whereIn('question_id', function($query) use ($cat, $strata) {
                    $query->select('id')->from('questions')
                        ->where('category_id', $cat->id)
                        ->where('is_' . $strata, true);
                })->sum('score');

            $maxScore = $totalQuestions * 10;
            $percentage = $maxScore > 0 ? round(($currentScore / $maxScore) * 100) : 0;
            $scores[] = $percentage;
        } else {
            $scores[] = 0; // Jika RS tidak ambil layanan ini
        }
    }

    return response()->json([
        'labels' => $labels,
        'scores' => $scores
    ]);
}
// Tambahkan di AssessmentController.php
public function getAuditLogs()
{
    // Mengambil 50 log terbaru
    $logs = \App\Models\AuditLog::orderBy('created_at', 'desc')->take(50)->get();
    
    // Format tanggal agar enak dibaca di Vue
    $formattedLogs = $logs->map(function($log) {
        return [
            'id' => $log->id,
            'user_name' => $log->user_name,
            'action' => $log->action,
            'description' => $log->description,
            'ip_address' => $log->ip_address,
            'created_at' => $log->created_at->format('d M Y H:i')
        ];
    });

    return response()->json($formattedLogs);
}
}