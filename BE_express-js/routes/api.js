const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const HospitalController = require("../controllers/HospitalController");
const IndicatorController = require("../controllers/IndicatorController");
const UserController = require("../controllers/UserController");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// ================= AUTH =================
router.post("/register", (req, res) => AuthController.register(req, res));
router.post("/login", (req, res) => AuthController.login(req, res));

// ================= HOSPITAL =================
router.get("/hospitals", auth, (req,res)=>HospitalController.index(req,res));
router.get("/hospitals/:id", auth, (req,res)=>HospitalController.show(req,res));

router.post("/hospitals", auth, authorize("admin"), (req,res)=>HospitalController.store(req,res));
router.put("/hospitals/:id", auth, authorize("admin"), (req,res)=>HospitalController.update(req,res));
router.delete("/hospitals/:id", auth, authorize("admin"), (req,res)=>HospitalController.destroy(req,res));

// ================= INDICATOR =================
router.get("/indicators", auth, (req,res)=>IndicatorController.index(req,res));
router.get("/indicators/:id", auth, (req,res)=>IndicatorController.show(req,res));

router.post("/indicators", auth, authorize("admin"), (req,res)=>IndicatorController.store(req,res));
router.put("/indicators/:id", auth, authorize("admin"), (req,res)=>IndicatorController.update(req,res));
router.delete("/indicators/:id", auth, authorize("admin"), (req,res)=>IndicatorController.destroy(req,res));

// ================= USER (ADMIN ONLY) =================
router.get("/users", auth, authorize("admin"), (req,res)=>UserController.index(req,res));
router.delete("/users/:id", auth, authorize("admin"), (req,res)=>UserController.destroy(req,res));

module.exports = router;