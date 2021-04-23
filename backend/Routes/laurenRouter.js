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

// Top {limit} words that appeared in songs with genre {category}
// most popular words in songs of different genres
// display a few wellknown genres? — country, pop, r&b, rap, rock
const topWordsByGenre = (req, res) => {
  const genre = 'pop';
  const limit = 10;
  var query = `
    SELECT DISTINCT l.word, l.popularity
    FROM Lyric l JOIN HasLyric h ON l.word = h.word
    JOIN Genre g ON g.song_id = h.song_id
    WHERE g.category = '${genre}'
    ORDER BY l.popularity
    LIMIT ${limit}
  `;

  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Top {limit} used lyrics in top {num} songs in the time range {lower} to {upper}
// most popular words in top 10 songs
// allow ppl to set range and rank
const topWordsByRankAndTime = (req, res) => {
  const limit = 10;
  const num = 10;
  const lower = 2000;
  const upper = 2010;

  var query = `
    SELECT l.word, COUNT(l.word) as count
    FROM Lyric l JOIN HasLyric h ON l.word = h.word
    JOIN BillboardAppearance b ON b.song_id = h.song_id
    WHERE b.position <= ${num} AND YEAR(b.week) >= ${lower} AND YEAR(b.week) <= ${upper}
    GROUP BY l.word
    ORDER BY COUNT(l.word) DESC
    LIMIT ${limit}
  `;

  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// What portion of Top 100 songs dominated by a specific genre?
// Percentage of songs from each genre (top {limit}) in time range {lower} to {upper}
// which genres are most commonly on the ranks
const topWordsByRankAndTime = (req, res) => {
  const limit = 10;
  const lower = 2000;
  const upper = 2010;

  var query = `
    WITH timeRangeCompiled AS (
    SELECT g.category, COUNT(g.category) as num
    FROM BillboardAppearance b JOIN Genre g ON b.song_id = g.song_id
    WHERE YEAR(b.week) >= ${lower} AND YEAR(b.week) <= ${upper}
    GROUP BY g.category
    )
    
    SELECT category, num/(SELECT SUM(num) FROM timeRangeCompiled) as percentage
    FROM timeRangeCompiled 
    ORDER BY num DESC
    LIMIT ${limit}
  `;

  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// Highest chart position of each genre in a certain time range?
// For each genre that appeared on the chart in the time range {lower} to {upper}, highest position of each genre
const topPosOfGenre = (req, res) => {
  const limit = 100;
  const lower = 2000;
  const upper = 2010;

  var query = `
    WITH timeRangeCompiled AS (
      SELECT g.category, COUNT(g.category) as num
      FROM BillboardAppearance b JOIN Genre g ON b.song_id = g.song_id
      GROUP BY g.category
    ),
    commonGenres AS (
    SELECT category
    FROM timeRangeCompiled 
    ORDER BY num DESC
    LIMIT 50
    )
    
    SELECT g.category, MIN(b.position) AS highest_position
    FROM Song s JOIN Genre g ON s.id = g.song_id
                JOIN BillboardAppearance b ON s.id = b.song_id
    WHERE YEAR(b.week) >= ${lower} AND YEAR(b.week) <= ${upper} AND g.category IN (SELECT * FROM commonGenres)
    GROUP BY g.category
    ORDER BY highest_position
    LIMIT ${limit}
  `;

  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};











// SELECT s.id
// FROM Song s JOIN BillboardAppearance b ON b.song_id = s.id
// WHERE b.position <= 25 AND YEAR(b.week) >= 2010 AND YEAR(b.week) <= 2020
// LIMIT 20;

// SELECT l.word, COUNT(l.word) as count
// FROM Lyric l JOIN HasLyric h ON l.word = h.word
// JOIN BillboardAppearance b ON b.song_id = h.song_id
// WHERE b.position <= 10 AND YEAR(b.week) >= 2000 AND YEAR(b.week) <= 2010
// GROUP BY l.word
// ORDER BY COUNT(l.word) DESC
// LIMIT 20;

// WITH timeRangeCompiled AS (
//   SELECT g.category, COUNT(g.category) as num
//   FROM BillboardAppearance b JOIN Genre g ON b.song_id = g.song_id
//   WHERE YEAR(b.week) >= 2010 AND YEAR(b.week) <= 2020
//   GROUP BY g.category
// )
// SELECT category, num/(SELECT SUM(num) FROM timeRangeCompiled) as percentage
// FROM timeRangeCompiled 
// ORDER BY num DESC
// LIMIT 20;

// WITH timeRangeCompiled AS (
//   SELECT g.category, COUNT(g.category) as num
//   FROM BillboardAppearance b JOIN Genre g ON b.song_id = g.song_id
//   GROUP BY g.category
// ),
// commonGenres AS (
// SELECT category
// FROM timeRangeCompiled 
// ORDER BY num DESC
// LIMIT 50
// )

// SELECT g.category, MIN(b.position) AS highest_position
// FROM Song s JOIN Genre g ON s.id = g.song_id
// 		        JOIN BillboardAppearance b ON s.id = b.song_id
// WHERE YEAR(b.week) >= 2010 AND YEAR(b.week) <= 2020 AND g.category IN (SELECT * FROM commonGenres)
// GROUP BY g.category
// ORDER BY highest_position;



connection.end();





















WITH cte AS (SELECT SUBSTR(category, 0, LENGTH(category) - 1) FROM Genre)
SELECT category
FROM cte
WHERE category = "teen pop"


module.exports = router