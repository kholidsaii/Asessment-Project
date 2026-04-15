const HospitalController = require("../controllers/HospitalController");
const UserController = require("../controllers/UserController");
const IndicatorController = require("../controllers/IndicatorController");
const express = require("express");
const router = express.Router();

// --- Hospital Routes ---
router.get("/hospitals", HospitalController.index);
router.get("/hospitals/:id", HospitalController.show);
router.post("/hospitals", HospitalController.store);
router.put("/hospitals/:id", HospitalController.update);
router.delete("/hospitals/:id", HospitalController.destroy);
router.get("/stats", HospitalController.getStats);
// --- User Routes ---
router.get("/users", UserController.index);
router.post("/users", UserController.store);
router.delete("/users/:id", UserController.destroy);
router.post("/login", UserController.login);

// --- Indicator Routes ---
router.get("/indicators", IndicatorController.index);
router.get("/indicators/:id", IndicatorController.show);
router.post("/indicators", IndicatorController.store);
router.put("/indicators/:id", IndicatorController.update);
router.delete("/indicators/:id", IndicatorController.destroy);

// PINDAHKAN KE SINI (Paling Bawah)
module.exports = router;