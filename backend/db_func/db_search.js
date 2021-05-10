const getConnection = require('../config')
let baseConnection = null;
getConnection(function(err, conn){
  if(err) return null;
  baseConnection = conn;
})

let conn1 = null; conn2 = null; conn3=null; conn4=null;
getConnection(function(err, conn){
  if(err) return null;
  conn1 = conn;
})
getConnection(function(err, conn){
  if(err) return null;
  conn2 = conn;
})
getConnection(function(err, conn){
  if(err) return null;
  conn3 = conn;
})
getConnection(function(err, conn){
  if(err) return null;
  conn4 = conn;
})
//STEPS TO OPTIMIZE
//performertitle song_id (p_song_id)

//subqueries: 1.67 to 0.28
const getGenres = (req, res) => {
  const lim = parseInt(req.params.lim) || 1000;
  var query = `
  WITH 
    timeRange AS (SELECT DISTINCT song_id FROM BillboardAppearance WHERE YEAR(week) >= 1990),
    genres AS (
    SELECT g.category
    FROM timeRange t JOIN Genre g ON t.song_id = g.song_id
    GROUP BY g.category
    ORDER BY COUNT(*) DESC
    LIMIT ${lim}
  )
  SELECT category
  FROM genres
  ORDER BY category;
  `;
  baseConnection.query(query, (err, rows, fields) => {
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

//for pop, 50: time from 2.2 sec to 0.14 sec

const topWordsByGenre = (req, res) => {
  const genre = req.params.gen == null ? "": req.params.gen.toLowerCase().replace("'", "\\'").trim();
  const limit = 50;
  var query = `
  WITH 
    temp AS (SELECT DISTINCT song_id FROM Genre WHERE category='${genre}'),
    temp1 AS (SELECT h.word, h.song_id FROM HasLyric h JOIN temp t ON t.song_id=h.song_id)
  SELECT word, ROUND(COUNT(song_id)/(SELECT COUNT(DISTINCT song_id) FROM temp1), 3) as count
  FROM temp1
  GROUP BY word
  ORDER BY count DESC
  LIMIT ${limit};
  `;

  conn1.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  }); 
};

// Top {limit} used lyrics in top {num} songs in the time range {lower} to {upper}
// most popular words in top 10 songs
// allow ppl to set range and rank

//STEPS TO OPTIMIZE
// Same as other query

//test query: 1990 to 2020 limit 50
//time from 3.76 to 1.32 sec
const topWordsByRankAndTime = (req, res) => {
  const limit = 50;
  const lower = parseInt(req.params.low) || -1;
  const upper = parseInt(req.params.up) || -1;
  var query = `
  WITH 
    timeRange AS (SELECT DISTINCT b.song_id FROM BillboardAppearance b
      WHERE (YEAR(b.week) >= ${lower} AND YEAR(b.week) <= ${upper === -1 ? 999999:upper})),
    temp AS (SELECT h.word, h.song_id FROM HasLyric h JOIN timeRange t ON h.song_id=t.song_id)
  SELECT word, ROUND(COUNT(song_id)/(SELECT COUNT(DISTINCT song_id) FROM temp), 3) as count
  FROM temp
  GROUP BY word
  ORDER BY count DESC
  LIMIT ${limit};
  `;

  conn2.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  }); 
};

// What portion of Top 100 songs dominated by a specific genre?
// Percentage of songs from each genre (top {limit}) in time range {lower} to {upper}
// which genres are most commonly on the ranks

//STEPS TO OPTIMIZE
// DISTINCT to reduce size

//test query 1950, 2020, limit 50
//time from 2.26 to 0.77
const topGenresByRankAndTime = (req, res) => {
  const limit = 50;
  const lower = parseInt(req.params.low) || -1;
  const upper = parseInt(req.params.up) || -1;

  var query = `
  WITH temp1 AS (
    SELECT DISTINCT song_id
    FROM BillboardAppearance
    WHERE (YEAR(week) >= ${lower}) AND 
    (YEAR(week) <= ${upper===-1 ? 999999:upper})
), temp AS (
    SELECT g.category, g.song_id
    FROM Genre g JOIN temp1 b ON b.song_id = g.song_id
    )
    
    SELECT category, ROUND(COUNT(*)/(SELECT COUNT(DISTINCT song_id) FROM temp), 3) as count
    FROM temp 
    GROUP BY category
    ORDER BY count DESC
    LIMIT ${limit};
  `;

  console.log(query);
  conn3.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  }); 
};

// Highest chart position of each genre in a certain time range?
// For each genre that appeared on the chart in the time range {lower} to {upper}, highest position of each genre

//STEPS TO OPTIMIZE
//Remove subqueries and add more JOIN conditions
//test query: 2010, 2020, 50
//time from 2.83 to 1.44 sec
const topPosOfGenre = (req, res) => {
  const lower = parseInt(req.params.low) || -1;
  const upper = parseInt(req.params.up) || -1;

  var query = `
  WITH 
    ranges AS (SELECT song_id, position FROM BillboardAppearance b WHERE (YEAR(week) >= ${lower} AND YEAR(week) <= ${upper===-1 ? 999999:upper}))
    SELECT g.category, MIN(r.position) as high 
    FROM Genre g JOIN ranges r ON g.song_id=r.song_id
    GROUP BY g.category
    ORDER BY high ASC, COUNT(*) DESC
  ` 
  conn4.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  }); 
};


// Search for everything with various arguments

//STEPS TO OPTIMIZE
// subquery results to find song_ids that satisfy conditions
// intersect all satisfactory ids and JOIN with tables with desired information
// only query tables if provided parameter isn't empty

// test query: 'love' keyword
// time from 31 sec to 1.82 sec
const searchEverything = (req, res) => {
  const limit = 100;
  const genre = req.params.gen == null ? "":req.params.gen.toLowerCase().replace("'", "\\'").trim();
  const lower = parseInt(req.params.low) || -1;
  const upper = parseInt(req.params.up) || -1;
  const position = parseInt(req.params.pos) || -1;
  const keyword = req.params.key == null ? "": req.params.key.toLowerCase().replace("'", "\\'").trim();

  var query = `
  WITH 
    minBill AS 
      (SELECT song_id, MIN(position) as position, MAX(weeks_on_chart) as weeks_on_chart, MAX(week) as recent
      FROM BillboardAppearance
      GROUP BY song_id),
    minGenre AS
      (SELECT song_id, GROUP_CONCAT(DISTINCT category SEPARATOR " | ") AS genre FROM Genre GROUP BY song_id),
    ${keyword === "" ? "": `performer AS 
      (SELECT DISTINCT song_id FROM PerformerTitle WHERE (LOWER(performer) LIKE "%${keyword}%" OR LOWER(title) LIKE "%${keyword}%")),
    lyric AS
      (SELECT DISTINCT song_id FROM HasLyric WHERE LOWER(word) LIKE "%${keyword}%"), 
    song AS
      (select DISTINCT id as song_id FROM Song WHERE LOWER(album) LIKE "%${keyword}%"),
    keywords AS
      ((SELECT song_id FROM song) UNION (SELECT song_id FROM performer) UNION (SELECT song_id FROM lyric)),`}
    genre AS 
      (SELECT DISTINCT song_id FROM Genre${genre === "" ? "": ` WHERE LOWER(category)="${genre}"`}),
    billboard AS
      (SELECT DISTINCT song_id FROM BillboardAppearance WHERE YEAR(week) >= ${lower === -1 ? -1:lower} 
      AND YEAR(week) <= ${upper === -1 ? 999999:upper} AND position <= ${position === -1 ? 101:position}),
    all_ids AS 
      (SELECT DISTINCT song_id FROM ${keyword === "" ? "billboard":"keywords INNER JOIN billboard USING(song_id)"} INNER JOIN genre USING(song_id))
  SELECT ai.song_id AS id, p.title, p.performer, b.position, g.genre
  FROM all_ids ai LEFT JOIN minBill b ON ai.song_id=b.song_id
        LEFT JOIN PerformerTitle p ON ai.song_id=p.song_id
        LEFT JOIN minGenre g on ai.song_id=g.song_id
  ORDER BY b.position ASC,  b.recent DESC, b.weeks_on_chart DESC
  LIMIT ${limit};
  `;
  console.log(query);
  baseConnection.query(query, (err, rows, fields) => {
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