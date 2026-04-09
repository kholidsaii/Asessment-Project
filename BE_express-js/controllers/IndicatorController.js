const Indicator = require("../models/Indicators");

class IndicatorController {
  index(req, res) {
    Indicator.getAll((err, results) => {
      if (err) return res.status(500).json({ message: "Gagal ambil data" });
      res.json({ data: results });
    });
  }
}

module.exports = new IndicatorController();