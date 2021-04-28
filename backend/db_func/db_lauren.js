const connection = require('../config')

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

// SELECT l.word, COUNT(l.word) as count
// FROM Lyric l JOIN HasLyric h ON l.word = h.word
// JOIN BillboardAppearance b ON b.song_id = h.song_id
// WHERE b.position <= 10 AND YEAR(b.week) >= 2000 AND YEAR(b.week) <= 2010
// GROUP BY l.word
// ORDER BY COUNT(l.word) DESC
// LIMIT 20;
// const topWordsByRankAndTime = (req, res) => {
//   const limit = 10;
//   const num = 10;
//   const lower = 2000;
//   const upper = 2010;

//   var query = `
//     SELECT l.word, COUNT(l.word) as count
//     FROM Lyric l JOIN HasLyric h ON l.word = h.word
//     JOIN BillboardAppearance b ON b.song_id = h.song_id
//     WHERE b.position <= ${num} AND YEAR(b.week) >= ${lower} AND YEAR(b.week) <= ${upper}
//     GROUP BY l.word
//     ORDER BY COUNT(l.word) DESC
//     LIMIT ${limit}
//   `;

//   connection.query(query, (err, rows, fields) => {
//     if  (err) console.log(err);
//     else {
//       res.json(rows);
//     }
//   });
// };

// What portion of Top 100 songs dominated by a specific genre?
// Percentage of songs from each genre (top {limit}) in time range {lower} to {upper}
// which genres are most commonly on the ranks

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


// Search for everything
// SELECT DISTINCT p.title, p.performer
// FROM Song s JOIN Genre g ON s.id = g.song_id
//             JOIN BillboardAppearance b ON s.id = b.song_id
//             JOIN HasLyric l ON s.id = l.song_id
//             JOIN PerformerTitle p ON s.id = p.song_id
// WHERE 
// ('pop' IS NULL OR g.category = 'pop') AND
// (1950 IS NULL OR YEAR(b.week) >= 1950) AND 
// (2020 IS NULL OR YEAR(b.week) <= 2020) AND 
// (10 IS NULL OR b.position <= 10) AND 
// ("britney spears" IS NULL OR 
//   p.performer = "britney spears" OR  
//   p.title = "britney spears" OR  
//   s.album = "britney spears" OR
//   l.word = "britney spears"
// )
// LIMIT 10;

const searchEverything = (req, res) => {
  const limit = 100;
  const genre = 'pop';
  const lower = 2000;
  const upper = 2010;
  const pos = 10;
  const keyword = 'britney spears'; // req.params.keyword;

  var query = `
    SELECT DISTINCT p.title, p.performer
    FROM Song s JOIN Genre g ON s.id = g.song_id
                JOIN BillboardAppearance b ON s.id = b.song_id
                JOIN HasLyric l ON s.id = l.song_id
                JOIN PerformerTitle p ON s.id = p.song_id
    WHERE 
    ('${genre}' IS NULL OR g.category = '${genre}') AND
    (${lower} IS NULL OR YEAR(b.week) >= ${lower}) AND 
    (${upper} IS NULL OR YEAR(b.week) <= ${upper}) AND 
    (${pos} IS NULL OR b.position <= ${pos}) AND 
    ('${keyword}' IS NULL OR 
      p.performer = "'${keyword}' OR  
      p.title = '${keyword}' OR  
      s.album = '${keyword}' OR
      l.word = '${keyword}'
    )
    LIMIT ${limit}
  `;

  

  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};
