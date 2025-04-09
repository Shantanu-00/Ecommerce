const db = require("../config/db");

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT user_id, name, email, password, role, address, phone_no, created_at FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0 ? results[0] : null);
      }
    );
  });
};

const findUserById = (userId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT user_id, name, email, role, address, phone_no, created_at FROM users WHERE user_id = ?",
      [userId],
      (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0 ? results[0] : null);
      }
    );
  });
};

const createUser = (name, email, hashedPassword, address, phone_no, role = "customer") => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO users (name, email, password, role, address, phone_no) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role, address, phone_no],
      (err, results) => {
        if (err) return reject(err);
        resolve(results.insertId);
      }
    );
  });
};

module.exports = { findUserByEmail, findUserById, createUser };