var mysql = require('mysql');
var env = require('dotenv')
env.config()

var pool = mysql.createPool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DBNAME
});


const getConnection = function(callback){
  pool.getConnection(function(err, conn){
    callback(err, conn)
  })
}


module.exports = getConnection;