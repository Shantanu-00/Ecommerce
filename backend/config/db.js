const mysql = require("mysql2/promise"); // Use promise-based version for cleaner async code

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

console.log("MySQL connection pool created.");

module.exports = db;