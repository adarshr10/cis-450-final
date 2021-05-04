const connection = require('../config')


// methods for artist and lyrics
// ----------------------------- ARTIST METHODS --------------------------

// get artist information like 
// - genres with songs in
// - number of songs in database
// - earliest/latest songs

// number of songs and peak position on billboard for each week 
const billboardPerformance = (req, res) => {
  const artist = req.params.artistName.toLowerCase().replace("'", "\\'");
  const query = `
  WITH songs AS (SELECT song_id FROM PerformerTitle WHERE LOWER(performer)='${artist}'),
  billboard AS (SELECT b.week, b.position, b.url 
    FROM BillboardAppearance b JOIN songs s ON b.song_id=s.song_id)
  SELECT b.week, b.url, MIN(IF(b.position = 0, 999999, b.position)) as peak, COUNT(b.week) as count
  FROM billboard b
  GROUP BY b.week, b.url
  ORDER BY b.week ASC;
  `
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

const topLyrics = (req, res, limit) => {
  const artist = req.params.artistName.toLowerCase().replace("'", "\\'");
  const query = `
  WITH songs AS (SELECT song_id FROM PerformerTitle WHERE LOWER(performer)='${artist}')
  SELECT h.word, SUM(h.count) as count, l.popularity as popularity
  FROM songs s JOIN HasLyric h ON s.song_id=h.song_id 
  JOIN Lyric l ON l.word=h.word
  GROUP BY h.word
  ORDER BY count DESC LIMIT ${limit};
  `
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// find artists who've had songs in same genres
// ordered by number of songs whose genre is in artist's genre list
// removed performers with "Featuring" and "&" in their name
const similarArtists = (req, res, limit) => {
  const artist = req.params.artistName.toLowerCase().replace("'", "\\'");
  const query = `
  WITH songs AS (SELECT p.performer, p.title, p.song_id, g.category
    FROM PerformerTitle p JOIN Genre g ON p.song_id=g.song_id),
    art_gens AS (SELECT DISTINCT category FROM songs WHERE LOWER(performer)='${artist}')
  SELECT performer AS artist
      FROM songs 
      WHERE LOWER(performer) <> '${artist}' AND LOWER(performer) NOT LIKE '%featuring%' AND LOWER(performer) NOT LIKE '% & %' AND category IN (SELECT * FROM art_gens)
      GROUP BY artist
      ORDER BY COUNT(song_id) DESC LIMIT ${limit};
  `
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// get genres that the artist has songs in
const artistGenres = (req, res) => {
  const artist = req.params.artistName.toLowerCase().replace("'", "\\'");
  const query = `
  WITH songs AS (SELECT DISTINCT song_id FROM PerformerTitle WHERE LOWER(performer)='${artist}')
  SELECT category, COUNT(song_id) AS count
  FROM Genre WHERE song_id IN (SELECT * FROM songs)
  GROUP BY category
  ORDER BY count DESC;
  `
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


// get top songs (top determined by peak position and number of weeks on chart)
const topSongs = (req, res, limit) => {
  const artist = req.params.artistName.toLowerCase().replace("'", "\\'");
  const query = `
  WITH Billboard AS (SELECT song_id, peak_position, weeks_on_chart FROM BillboardAppearance)
  SELECT p.title, MIN(IF(b.peak_position = 0, 999999, b.peak_position)) as peak, MAX(IF(b.weeks_on_chart=0, -1, b.weeks_on_chart)) as weeks 
    FROM PerformerTitle p JOIN Billboard b ON p.song_id=b.song_id
    WHERE LOWER(p.performer) = '${artist}'
    GROUP BY p.title
    ORDER BY peak ASC, weeks DESC
    LIMIT ${limit};
  `
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


// -------------------------------------- LYRIC METHODS ---------------------------------------
const lyricTopGenre = (req, res, limit) => {
  const lyric = req.params.lyric.toLowerCase().replace("'", "\\'");
  const query = `
  WITH lyric AS (SELECT h.count, g.category FROM HasLyric h JOIN Genre g ON LOWER(h.word)='${lyric}' AND h.song_id=g.song_id)
  SELECT category, SUM(count) as count FROM lyric
  GROUP BY category ORDER BY count DESC LIMIT ${limit};
  `
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

const lyricTopArtist = (req, res, limit) => {
  const lyric = req.params.lyric.toLowerCase().replace("'", "\\'");
  const query = `
  WITH lyric AS (SELECT p.performer, h.count FROM HasLyric h JOIN PerformerTitle p ON LOWER(h.word) = '${lyric}' AND h.song_id=p.song_id)
  SELECT performer, SUM(count) as count FROM lyric
  GROUP BY performer ORDER BY count DESC LIMIT ${limit};
  `
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

const lyricTopSongs = (req, res, limit) => {
  const lyric = req.params.lyric.toLowerCase().replace("'", "\\'");
  const query = `
  SELECT p.performer, p.title, h.count 
  FROM PerformerTitle p JOIN HasLyric h on LOWER(h.word)='${lyric}' AND p.song_id=h.song_id
  ORDER BY h.count DESC LIMIT ${limit};
  `
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

const lyricBillboard = (req, res) => {
  const lyric = req.params.lyric.toLowerCase().replace("'", "\\'");
  const query = `
  WITH billboard AS 
    (SELECT b.week, b.url, h.count FROM BillboardAppearance b JOIN HasLyric h ON LOWER(h.word)='babi' AND b.song_id=h.song_id)
  SELECT week, url, SUM(count) as word_count, COUNT(count) as song_count FROM billboard
  GROUP BY week, url ORDER BY week ASC;
  `
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}



module.exports = {
  topSongs: topSongs,
  artistGenres: artistGenres,
  similarArtists: similarArtists,
  topLyrics: topLyrics,
  billboardPerformance: billboardPerformance,
  lyricTopArtist: lyricTopArtist,
  lyricTopGenre: lyricTopGenre,
  lyricTopSongs: lyricTopSongs,
  lyricBillboard: lyricBillboard
}