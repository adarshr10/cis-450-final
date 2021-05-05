const connection = require('../config')


const getGenres = (req, res) => {
  const lim = req.params.lim || 1000;
  var query = `
  WITH timeRangeCompiled AS (
    SELECT g.category, COUNT(g.category) as num
    FROM BillboardAppearance b JOIN Genre g ON b.song_id = g.song_id
    WHERE YEAR(b.week) >= 1990
    GROUP BY g.category
  ), top AS (
    SELECT category
    FROM timeRangeCompiled 
    ORDER BY num DESC
    LIMIT ${lim}
  )
  SELECT category
  FROM top
  ORDER BY category;
  `;

  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// 0: TOP WORDS BY GENRE
// Top {limit} words that appeared in songs with genre {category}
// most popular words in songs of different genres
// display a few wellknown genres? — country, pop, r&b, rap, rock


//STEPS TO OPTIMIZE
// Add DISTINCT to decrease intermediate result
// Changed JOIN orders to JOIN on smaller relations first
//Removed unnecessary JOINs

//time from 3.8 sec to 2 sec

const topWordsByGenre = (req, res) => {
  const genre = req.params.gen == null ? " ": req.params.gen.toLowerCase().replace("'", "\\'").trim();
  const limit = 50;
  var query = `
  WITH temp AS (
    SELECT DISTINCT h.word, b.song_id
    FROM BillboardAppearance b JOIN Genre g ON g.song_id = b.song_id AND g.category = '${genre}' 
    JOIN HasLyric h ON b.song_id = h.song_id
  )
  
  SELECT word, ROUND(COUNT(song_id)/(SELECT COUNT(DISTINCT song_id) FROM temp), 3) as count
  FROM temp
  GROUP BY word
  ORDER BY count DESC
  LIMIT ${limit};
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

// WITH temp AS (
// 	SELECT h.word, b.song_id, b.position
// 	FROM BillboardAppearance b JOIN HasLyric h ON b.song_id = h.song_id
// 	WHERE (1990 = -1 || YEAR(b.week) >= 1990) AND
// 	(2010 = -1 || YEAR(b.week) <= 2010)
// )

// SELECT l.word, COUNT(DISTINCT b.song_id)/(SELECT COUNT(DISTINCT song_id) FROM temp) as num
// FROM Lyric l JOIN temp b ON b.word = l.word
// WHERE (-1 = -1 || b.position <= -1)
// GROUP BY l.word
// ORDER BY num DESC
// LIMIT 50;

// SELECT l.word, ROUND(COUNT(DISTINCT b.song_id)/(SELECT COUNT(DISTINCT song_id) FROM temp), 3) as count
// FROM Lyric l JOIN temp b ON b.word = l.word
// WHERE (${num} = -1 || b.position <= ${num})
// GROUP BY l.word
// ORDER BY count DESC
// LIMIT ${limit};

//STEPS TO OPTIMIZE
// Same as other query

//test query: 1990 to 2020 limit 50
//time from 7.62 to 3.8
const topWordsByRankAndTime = (req, res) => {
  const limit = 50;
  //const num = req.params.pos;
  const lower = req.params.low || -1;
  const upper = req.params.up || -1;

  var query = `
  WITH temp AS (
    SELECT DISTINCT h.word, b.song_id
    FROM BillboardAppearance b JOIN HasLyric h ON b.song_id = h.song_id
    AND (${lower} = -1 OR YEAR(b.week) >= ${lower}) AND
    (${upper} = -1 OR YEAR(b.week) <= ${upper})
  )
  
  SELECT word, ROUND(COUNT(song_id)/(SELECT COUNT(DISTINCT song_id) FROM temp), 3) as count
  FROM temp
  GROUP BY word
  ORDER BY count DESC
  LIMIT 50;
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

// WITH temp1 AS (
//   SELECT song_id
//   FROM BillboardAppearance
//   WHERE (1990 = -1 || YEAR(week) >= 1990) AND 
//   (2010 = -1 || YEAR(week) <= 2010)
// ), temp AS (
//   SELECT g.category, g.song_id
//   FROM temp1 b JOIN Genre g ON b.song_id = g.song_id
//   )
  
//   SELECT category, ROUND(COUNT(*)/(SELECT COUNT(*) FROM temp1), 3) as count
//   FROM temp 
//   GROUP BY category
//   ORDER BY count DESC
//   LIMIT 50;

//STEPS TO OPTIMIZE
// DISTINCT to reduce size

//test query 1950, 2020, limit 50
//time from 2.26 to 0.77
const topGenresByRankAndTime = (req, res) => {
  const limit = 50;
  const lower = req.params.low || -1;
  const upper = req.params.up || -1;

  var query = `
  WITH temp1 AS (
    SELECT DISTINCT song_id
    FROM BillboardAppearance
    WHERE (${lower} = -1 OR YEAR(week) >= ${lower}) AND 
    (${upper} = -1 OR YEAR(week) <= ${upper})
), temp AS (
    SELECT g.category, g.song_id
    FROM temp1 b JOIN Genre g ON b.song_id = g.song_id
    )
    
    SELECT category, ROUND(COUNT(*)/(SELECT COUNT(*) FROM temp1), 3) as count
    FROM temp 
    GROUP BY category
    ORDER BY count DESC
    LIMIT ${limit};
  `;

  console.log(query);
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

//STEPS TO OPTIMIZE
//Remove subqueries and add more JOIN conditions
//test query: 1950, 2020, 100
//time from 4.24 to 2.23
const topPosOfGenre = (req, res) => {
  const limit = 100;
  const lower = req.params.low || -1;
  const upper = req.params.up || -1;

  var query = `
  SELECT g.category, MIN(IF(b.position = 0, 999999, b.position)) AS high
  FROM BillboardAppearance b JOIN Genre g 
  ON b.song_id = g.song_id AND (${lower} = -1 OR YEAR(b.week) >= ${lower}) AND (${upper} = -1 OR YEAR(b.week) <= ${upper})
  GROUP BY g.category
  ORDER BY high LIMIT ${limit};
  `;

  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


// Search for everything
// SELECT p.title, p.performer, MAX(b.position)
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
// GROUP BY p.title, p.performer
// LIMIT 10;
// SELECT DISTINCT s.id, p.title, p.performer, MIN(b.position) as position
//     FROM Song s JOIN Genre g ON s.id = g.song_id
//                 JOIN BillboardAppearance b ON s.id = b.song_id
//                 JOIN PerformerTitle p ON s.id = p.song_id
//                 LEFT JOIN HasLyric l ON s.id = l.song_id
//     WHERE 
//     (' ' = " " OR g.category = '') AND
//     (-1 = -1 OR YEAR(b.week) >= ' ') AND 
//     (-1 = -1 OR YEAR(b.week) <= ' ') AND 
//     (-1 = -1 OR b.position <= ' ') AND 
//     ('britney spears' = ' ' OR 
//       LOWER(p.performer) = 'britney spears' OR  
//       LOWER(p.title) = 'britney spears' OR  
//       LOWER(s.album) = 'britney spears' OR
//      (s.id = l.song_id AND LOWER(l.word) = 'britney spears')
//     )
//     GROUP BY p.title, p.performer
//     ORDER BY position
//     LIMIT 100;


//STEPS TO OPTIMIZE
// subquery results to find song_ids that satisfy conditions
// union all satisfactory ids and JOIN with tables with desired information

// test query: just britney spears
// time from 29 sec to 0.13 sec
const searchEverything = (req, res) => {
  // const limit = 100;
  // const genre = req.params.genre;
  // const lower = 2000;
  // const upper = 2010;
  // const position = 10;
  // const keyword = 'britney spears'; // req.params.keyword;
  const limit = 100;
  const genre = req.params.gen == null ? " ":req.params.gen.toLowerCase().replace("'", "\\'").trim();
  const lower = req.params.low || -1;
  const upper = req.params.up || -1;
  const position = req.params.pos || -1;
  const keyword = req.params.key == null ? " ": req.params.key.toLowerCase().replace("'", "\\'").trim();

  var query = `
  WITH 
    performer AS 
      (SELECT DISTINCT song_id FROM PerformerTitle WHERE '${keyword}' <> " " AND (LOWER(performer) LIKE '%${keyword}%' OR LOWER(title) LIKE '%${keyword}%')),
    genre AS 
      (SELECT DISTINCT song_id FROM Genre WHERE '${genre}' <> " " AND LOWER(category) LIKE '%${genre}%'),
    billboard AS
      (SELECT DISTINCT song_id FROM BillboardAppearance 
      WHERE (${lower} <> -1 AND YEAR(week) >= ${lower}) OR (${upper} <> -1 AND YEAR(week) <= ${upper}) OR (${position} <> -1 AND position <= ${position})),
    lyric AS
      (SELECT DISTINCT song_id FROM HasLyric WHERE '${keyword}' <> " " AND word='${keyword}'), 
    song AS
      (select DISTINCT id FROM Song WHERE '${keyword}' <> " " AND album LIKE "%${keyword}%"),
    all_ids AS 
      ((SELECT song_id FROM performer) UNION (SELECT song_id FROM genre) UNION (SELECT song_id FROM billboard) UNION (SELECT song_id FROM lyric)
        UNION (SELECT id as song_id FROM song))
  SELECT ai.song_id AS id, p.title, p.performer, MIN(b.position) as position, GROUP_CONCAT(DISTINCT g.category SEPARATOR ", ") AS genre
  FROM all_ids ai LEFT JOIN Genre g on ai.song_id=g.song_id
        LEFT JOIN PerformerTitle p ON ai.song_id=p.song_id
        LEFT JOIN BillboardAppearance b ON ai.song_id=b.song_id
  GROUP BY ai.song_id, p.title, p.performer
  ORDER BY position 
  LIMIT ${limit};
  `;
  console.log(query);
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


module.exports = {
  searchEverything: searchEverything,
  topPosOfGenre: topPosOfGenre,
  topWordsByRankAndTime: topWordsByRankAndTime,
  topGenresByRankAndTime: topGenresByRankAndTime,
  topWordsByGenre: topWordsByGenre,
  getGenres: getGenres
}