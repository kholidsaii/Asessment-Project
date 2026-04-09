const Hospital = require("../models/Hospital");
const errorHandler = require("../utils/errorHandler");

class HospitalController {

  index(req, res){
    Hospital.getAll((err, results)=>{
      if(err){
        return errorHandler(res, err, 500, "Gagal ambil data hospital");
      }

      if(results.length == 0){
        return res.status(404).json({
          message: "Data hospital kosong"
        });
      }

      res.json({
        message: "Berhasil ambil semua data hospital",
        data: results
      });
    });
  }

  show(req, res){
    const {id} = req.params;

    Hospital.getById(id, (err, results)=>{
      if(err){
        return errorHandler(res, err, 500, "Gagal ambil detail hospital");
      }

      if(results.length == 0){
        return res.status(404).json({
          message: "Hospital tidak ditemukan"
        });
      }

      res.json({
        message: "Detail hospital",
        data: results[0]
      });
    });
  }

  store(req, res){
    const data = req.body;

    Hospital.create(data, (err)=>{
      if(err){
        return errorHandler(res, err, 500, "Gagal tambah hospital");
      }

      res.status(201).json({
        message: "Hospital berhasil ditambahkan",
        data: data
      });
    });
  }

  update(req, res){
    const {id} = req.params;
    const data = req.body;

    Hospital.update(id, data, (err)=>{
      if(err){
        return errorHandler(res, err, 500, "Gagal update hospital");
      }

      res.json({
        message: "Hospital berhasil diupdate"
      });
    });
  }

  destroy(req, res){
    const {id} = req.params;

    Hospital.delete(id, (err)=>{
      if(err){
        return errorHandler(res, err, 500, "Gagal hapus hospital");
      }

      res.json({
        message: "Hospital berhasil dihapus"
      });
    });
  }
}

module.exports = new HospitalController();