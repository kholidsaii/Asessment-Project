<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AssessmentController;
use App\Http\Controllers\Api\MappingController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

// Rute Publik/Dashboard
Route::get('/categories', [AssessmentController::class, 'getCategories']);
Route::get('/hospitals', [MappingController::class, 'index']); 
Route::get('/hospitals/active', [MappingController::class, 'getActiveHospital']);
Route::get('/hospitals/{id}', [MappingController::class, 'show']);
Route::get('/dashboard/assessments', [AssessmentController::class, 'getDashboardData']);
Route::get('/reports/all', [AssessmentController::class, 'getAllReports']);
Route::get('/analytics/radar', [AssessmentController::class, 'getRadarData']);
Route::get('/audit-logs', [AssessmentController::class, 'getAuditLogs']);
// Rute yang WAJIB Login & Token
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/hospitals/mapping', [MappingController::class, 'store']);
    Route::post('/assessments/save', [AssessmentController::class, 'saveScore']);
    
    // Master Indikator Management
    Route::get('/questions', [AssessmentController::class, 'getQuestionsByCategory']);
    Route::post('/questions', [AssessmentController::class, 'storeQuestion']);
    Route::post('/questions/{id}/update-strata', [AssessmentController::class, 'updateStrata']);
    Route::put('/questions/{id}', [AssessmentController::class, 'updateQuestion']);
    Route::delete('/questions/{id}', [AssessmentController::class, 'destroyQuestion']);
    Route::get('/users', [AuthController::class, 'index']);           // List semua user
    Route::post('/users', [AuthController::class, 'register']);      // Tambah user baru
    Route::put('/users/{id}/role', [AuthController::class, 'updateRole']); // Ganti role
    Route::delete('/users/{id}', [AuthController::class, 'destroy']); // Hapus user
});