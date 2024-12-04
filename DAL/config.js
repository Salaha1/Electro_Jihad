const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'Salah',
  password: '1234',
  database: 'wfp-salah',
});

module.exports = db;