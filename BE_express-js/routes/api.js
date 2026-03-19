const HospitalController = require("../controllers/HospitalController");

const express = require("express");
const router = express.Router();

router.get("/", (req, res) =>{
    res.send("Hello Express! Ini adalah tampilan kosong projek kelompok Dream Team");
});

router.get("/hospitals", HospitalController.index);
router.post("/hospitals", HospitalController.store);
router.put("/hospitals/:id", HospitalController.update);
router.delete("/hospitals/:id", HospitalController.destroy);
router.get("/hospitals/:id", HospitalController.show);

module.exports = router;