const express = require("express");
const router = express.Router();

const AssessmentController = require("../controllers/AssessmentController");
const AuthController = require("../controllers/AuthController");
const HospitalController = require("../controllers/HospitalController");
const IndicatorController = require("../controllers/IndicatorController");
const UserController = require("../controllers/UserController");
const QuestionController = require("../controllers/QuestionController");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/upload");

// ================= AUTH =================
router.post("/register", (req, res) => AuthController.register(req, res));
router.post("/login", (req, res) => AuthController.login(req, res));

// ================= ASSESSMENT =================
router.post("/assessments", auth, upload.single("photo"), (req, res) =>
  AssessmentController.submitScore(req, res)
);

router.get("/assessments/recent", auth, (req, res) =>
  AssessmentController.getLatestActivities(req, res)
);

router.get("/assessments/report/:hospital_id", auth, (req, res) =>
  AssessmentController.getHospitalReport(req, res)
);

// ================= DASHBOARD CHARTS =================
// Route ini aman jika kamu sudah memakai patch grafik. Kalau controller belum punya method ini,
// jangan panggil URL ini dari frontend atau gunakan patch grafik dashboard sebelumnya.
if (typeof AssessmentController.getAdminCharts === "function") {
  router.get("/dashboard/admin/charts", auth, authorize("admin"), (req, res) =>
    AssessmentController.getAdminCharts(req, res)
  );
}

if (typeof AssessmentController.getUserCharts === "function") {
  router.get("/dashboard/user/charts/:hospital_id", auth, (req, res) =>
    AssessmentController.getUserCharts(req, res)
  );
}

// ================= QUESTION =================
router.get("/questions", auth, (req, res) =>
  QuestionController.index(req, res)
);

router.get("/questions/:id", auth, authorize("admin"), (req, res) =>
  QuestionController.show(req, res)
);

router.post("/questions", auth, authorize("admin"), (req, res) =>
  QuestionController.store(req, res)
);

router.put("/questions/:id", auth, authorize("admin"), (req, res) =>
  QuestionController.update(req, res)
);

router.delete("/questions/:id", auth, authorize("admin"), (req, res) =>
  QuestionController.destroy(req, res)
);

// ================= HOSPITAL =================
router.get("/hospitals", auth, (req, res) =>
  HospitalController.index(req, res)
);

router.get("/hospitals/stats", auth, authorize("admin"), (req, res) =>
  HospitalController.getStats(req, res)
);

router.get("/hospitals/:id", auth, (req, res) =>
  HospitalController.show(req, res)
);

router.post("/hospitals", auth, authorize("admin"), (req, res) =>
  HospitalController.store(req, res)
);

router.put("/hospitals/:id", auth, authorize("admin"), (req, res) =>
  HospitalController.update(req, res)
);

router.delete("/hospitals/:id", auth, authorize("admin"), (req, res) =>
  HospitalController.destroy(req, res)
);

// ================= INDICATOR =================
router.get("/indicators", auth, (req, res) =>
  IndicatorController.index(req, res)
);

router.get("/indicators/:id", auth, (req, res) =>
  IndicatorController.show(req, res)
);

router.post("/indicators", auth, authorize("admin"), (req, res) =>
  IndicatorController.store(req, res)
);

router.put("/indicators/:id", auth, authorize("admin"), (req, res) =>
  IndicatorController.update(req, res)
);

router.delete("/indicators/:id", auth, authorize("admin"), (req, res) =>
  IndicatorController.destroy(req, res)
);

// ================= USER =================
router.get("/users", auth, authorize("admin"), (req, res) =>
  UserController.index(req, res)
);

router.get("/users/:id", auth, authorize("admin"), (req, res) =>
  UserController.show(req, res)
);

router.post("/users", auth, authorize("admin"), (req, res) =>
  UserController.store(req, res)
);

router.put("/users/:id", auth, authorize("admin"), (req, res) =>
  UserController.update(req, res)
);

router.delete("/users/:id", auth, authorize("admin"), (req, res) =>
  UserController.destroy(req, res)
);

module.exports = router;
