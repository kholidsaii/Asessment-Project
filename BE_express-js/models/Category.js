const db = require("../config/database"); 

class Category {
  static getAll(callback) {
    const query = "SELECT * FROM categories"; 
    db.query(query, (err, results) => {
      callback(err, results);
    });
  }

  static getById(id, callback) {
    const query = "SELECT * FROM categories WHERE id = ?";
    db.query(query, [id], (err, results) => {
      callback(err, results);
    });
  }


  static create(data, callback) {
    const query = "INSERT INTO categories SET ?";
    db.query(query, [data], (err, results) => {
      callback(err, results);
    });
  }

  static update(id, data, callback) {
    const query = "UPDATE categories SET ? WHERE id = ?";
    db.query(query, [data, id], (err, results) => {
      callback(err, results);
    });
  }

  static delete(id, callback) {
    const query = "DELETE FROM categories WHERE id = ?";
    db.query(query, [id], (err, results) => {
      callback(err, results);
    });
  }
}

module.exports = Category;