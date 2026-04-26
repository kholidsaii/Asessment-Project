const HospitalController = require("../controllers/HospitalController");
const UserController = require("../controllers/UserController");
const IndicatorController = require("../controllers/IndicatorController");
const AssessmentController = require("../controllers/AssessmentController");
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const upload = require("../middleware/upload");
// ==========================================
// 1. PUBLIC ROUTES (Tanpa Login)
// ==========================================
router.post("/login", UserController.login);
router.post("/users/register", UserController.store);
router.post("/users/login", UserController.login);
// Route Assessment dengan Foto Bukti
router.post(
  "/assessments", 
  verifyToken(['admin', 'user']), 
  upload.single("photo"), // "photo" adalah nama field di Postman 
  AssessmentController.submitScore
);
// ==========================================
// 2. PROTECTED ROUTES (Harus Login)
// ==========================================

// --- Hospital Routes ---
// Semua yang login bisa lihat
router.get("/hospitals", verifyToken(), HospitalController.index);
router.get("/hospitals/:id", verifyToken(), HospitalController.show);
// Hanya Admin
router.post("/hospitals", verifyToken(['admin']), HospitalController.store);
router.put("/hospitals/:id", verifyToken(['admin']), HospitalController.update);
router.delete("/hospitals/:id", verifyToken(['admin']), HospitalController.destroy);

// --- Assessment Routes ---
// Admin & User bisa isi asessment
router.post("/assessments", verifyToken(['admin', 'user']), AssessmentController.submitScore);
router.get("/assessments/report/:hospital_id", verifyToken(), AssessmentController.getHospitalReport);

// --- Indicator Routes ---
// Semua yang login bisa lihat indikator
router.get("/indicators", verifyToken(), IndicatorController.index);
router.get("/indicators/:id", verifyToken(), IndicatorController.show);
// Hanya Admin yang bisa atur indikator
router.post("/indicators", verifyToken(['admin']), IndicatorController.store);
router.put("/indicators/:id", verifyToken(['admin']), IndicatorController.update);
router.delete("/indicators/:id", verifyToken(['admin']), IndicatorController.destroy);

// --- User Management (Admin Only) ---
router.get("/users", verifyToken(['admin']), UserController.index);
router.delete("/users/:id", verifyToken(['admin']), UserController.destroy);

module.exports = router;