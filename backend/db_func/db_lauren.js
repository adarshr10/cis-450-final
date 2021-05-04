const connection = require('../config')


const getGenres = (req, res) => {
  const lim = req.params.lim;
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
const topWordsByGenre = (req, res) => {
  const genre = req.params.gen;
  const limit = 50;
  var query = `
  WITH temp AS (
    SELECT h.word, b.song_id
    FROM BillboardAppearance b JOIN HasLyric h ON b.song_id = h.song_id
    JOIN Genre g ON g.song_id = h.song_id
    WHERE g.category = '${genre}'
  )
  
  SELECT l.word, ROUND(COUNT(DISTINCT b.song_id)/(SELECT COUNT(DISTINCT song_id) FROM temp), 3) as count
  FROM Lyric l JOIN temp b ON b.word = l.word
  GROUP BY l.word
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
const topWordsByRankAndTime = (req, res) => {
  const limit = 50;
  //const num = req.params.pos;
  const lower = req.params.low;
  const upper = req.params.up;

  var query = `
  WITH temp AS (
    SELECT h.word, b.song_id
    FROM BillboardAppearance b JOIN HasLyric h ON b.song_id = h.song_id
    WHERE (${lower} = -1 || YEAR(b.week) >= ${lower}) AND
    (${upper} = -1 || YEAR(b.week) <= ${upper})
  )
  
  SELECT l.word, ROUND(COUNT(DISTINCT b.song_id)/(SELECT COUNT(DISTINCT song_id) FROM temp), 3) as count
  FROM Lyric l JOIN temp b ON b.word = l.word
  GROUP BY l.word
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
const topGenresByRankAndTime = (req, res) => {
  const limit = 50;
  const lower = req.params.low;
  const upper = req.params.up;

  var query = `
  WITH temp1 AS (
    SELECT song_id
    FROM BillboardAppearance
    WHERE (${lower} = -1 || YEAR(week) >= ${lower}) AND 
    (${upper} = -1 || YEAR(week) <= ${upper})
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
const topPosOfGenre = (req, res) => {
  const limit = 100;
  const lower = req.params.low;
  const upper = req.params.up;

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
    LIMIT ${limit}
    )
    
    SELECT g.category, MIN(b.position) AS high
    FROM Song s JOIN Genre g ON s.id = g.song_id
                JOIN BillboardAppearance b ON s.id = b.song_id
    WHERE (${lower} = -1 || YEAR(week) >= ${lower}) AND (${upper} = -1 || YEAR(week) <= ${upper}) AND g.category IN (SELECT * FROM commonGenres)
    GROUP BY g.category
    ORDER BY high
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

const searchEverything = (req, res) => {
  // const limit = 100;
  // const genre = req.params.genre;
  // const lower = 2000;
  // const upper = 2010;
  // const position = 10;
  // const keyword = 'britney spears'; // req.params.keyword;
  const limit = 100;
  const genre = req.params.gen;
  const lower = req.params.low;
  const upper = req.params.up;
  const position = req.params.pos;
  var keyword;
  if (req.params.key) keyword = (req.params.key).trimStart();
  else keyword = " ";

  var query = `
    SELECT DISTINCT s.id, p.title, p.performer, MIN(b.position) as position
    FROM Song s JOIN Genre g ON s.id = g.song_id
                JOIN BillboardAppearance b ON s.id = b.song_id
                JOIN PerformerTitle p ON s.id = p.song_id
                LEFT JOIN HasLyric l ON s.id = l.song_id
    WHERE 
    ('${genre}' = " " OR g.category = '${genre}') AND
    (${lower} = -1 OR YEAR(b.week) >= ${lower}) AND 
    (${upper} = -1 OR YEAR(b.week) <= ${upper}) AND 
    (${position} = -1 OR b.position <= ${position}) AND 
    ('${keyword}' = ' ' OR 
      p.performer = '${keyword}' OR  
      p.title = '${keyword}' OR  
      s.album = '${keyword}' OR
     (s.id = l.song_id AND l.word = '${keyword}')
    )
    GROUP BY p.title, p.performer
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