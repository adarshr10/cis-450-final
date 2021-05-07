var mysql = require('mysql');
var env = require('dotenv')
env.config()
var connection = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DBNAME
});

const conn2 = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DBNAME
});

conn2.connect(function(err) {
  if (err) {
    console.error('Database connection 2 failed: ' + err.stack);
    return;
  }

  console.log('Connected to database 2.');
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

module.exports = {connection: connection, conn2:conn2}