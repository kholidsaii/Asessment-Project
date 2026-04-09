const HospitalController = require("../controllers/HospitalController");
const UserController = require("../controllers/UserController"); // Import controller user baru
const express = require("express");
const router = express.Router();

// --- Hospital Routes ---
router.get("/hospitals", HospitalController.index);
router.get("/hospitals/:id", HospitalController.show);
router.post("/hospitals", HospitalController.store);
router.put("/hospitals/:id", HospitalController.update);
router.delete("/hospitals/:id", HospitalController.destroy);

// --- User Routes ---
router.get("/users", UserController.index);
router.post("/users", UserController.store);
router.delete("/users/:id", UserController.destroy);

// Route untuk login
router.post("/login", UserController.login);
module.exports = router;