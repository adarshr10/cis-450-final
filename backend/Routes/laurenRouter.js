var express = require('express')
var router = express.Router();
var env = require('dotenv')
env.config()

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DBNAME
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});


const lyricInformation = (req, res) => {
  const songId = req.params.songId;
  var query = `
    SELECT h.word, h.count, l.popularity
    FROM HasLyrics h JOIN Lyric l ON h.word = l.word
    WHERE h.song_id = '${songId}'
  `;
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

connection.end();

























module.exports = router