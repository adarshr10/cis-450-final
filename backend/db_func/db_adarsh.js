const connection = require('../config')

/**
 * 
 * Methods and routes for songs and song page
 * 
 */
const songBillboardInformation = (req, res) => {
  const songId = req.params.songId.replace("'", "\\'");
  var query = `
    SELECT week, position FROM BillboardAppearance b
    WHERE b.song_id = '${songId}';
  `;
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

const songOverviewInformation = (req, res) => {
  const songId = req.params.songId.replace("'", "\\'");
  var query = `
    SELECT DISTINCT * 
    FROM Song s JOIN PerformerTitle p ON s.id = p.song_id LEFT JOIN URL u ON s.id = u.song_id
    WHERE s.id = '${songId}';
  `;
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

const songGenres = (req, res) => {
  const songId = req.params.songId.replace("'", "\\'");
  var query = `
    SELECT DISTINCT g.category 
    FROM Song s JOIN Genre g ON s.id = g.song_id
    WHERE s.id = '${songId}';
  `;
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

const songLyricInformation = (req, res) => {
  const songId = req.params.songId.replace("'", "\\'");
  var query = `
    SELECT h.word, h.count, l.popularity
    FROM HasLyric h JOIN Lyric l ON h.word = l.word
    WHERE h.song_id = '${songId}' ORDER BY h.count DESC;
  `;
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/**
 * Song similarity determined by:
 * - Matching at least 1 genres
 * - Matching at least 5 top 20 words (most frequently used)
 */

const songSimilarSongs = (req, res) => {
  const songId = req.params.songId.replace("'", "\\'");
  var checkQuery = `
    SELECT count(*) as num FROM HasLyric h WHERE h.song_id = '${songId}';
  `
  connection.query(checkQuery, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      const numberOfResponses = JSON.parse(JSON.stringify(rows[0])).num;
      var query = "";
      if (numberOfResponses) {
        query = `
          WITH song_genres AS (
            SELECT s.id, g.category FROM Song s JOIN Genre g ON s.id = g.song_id WHERE s.id = '${songId}'
          ), genre_matches AS (
            SELECT g.song_id, count(g.song_id) FROM song_genres sg JOIN Genre g ON sg.category = g.category 
            WHERE g.song_id != sg.id
            GROUP BY g.song_id HAVING count(g.song_id) > 0
          ), top_lyrics AS (
            SELECT s.id, h.word FROM Song s JOIN HasLyric h ON s.id = h.song_id WHERE s.id = '${songId}'
            ORDER BY h.count DESC LIMIT 20
          ), similar_songs AS (
            SELECT gm.song_id, h.word, h.count FROM genre_matches gm JOIN HasLyric h ON  gm.song_id = h.song_id JOIN top_lyrics tl ON h.word = tl.word
            WHERE gm.song_id != tl.id
            GROUP BY gm.song_id HAVING count(gm.song_id) > 5
          )
          SELECT s.song_id, p.title, p.performer FROM similar_songs s JOIN PerformerTitle p ON s.song_id = p.song_id;
        `;
      } else {
        query = `
          WITH song_genres AS (
            SELECT s.id, g.category FROM Song s JOIN Genre g ON s.id = g.song_id WHERE s.id = '${songId}'
          ), similar_songs AS (
            SELECT g.song_id, count(g.song_id) FROM song_genres sg JOIN Genre g ON sg.category = g.category 
            WHERE g.song_id != sg.id
            GROUP BY g.song_id HAVING count(g.song_id) > 1
          )
          SELECT s.song_id, p.title, p.performer FROM similar_songs s JOIN PerformerTitle p ON s.song_id = p.song_id;
        `;
      }
      connection.query(query, (err, rows, fields) => {
        if  (err) console.log(err);
        else {
          res.json(rows);
        }
      });
    }
  });
};


/**
 * 
 * Methods and routes for genres and genre page
 * 
 */

const genreLyricInformation = (req, res) => {
  const genre = req.params.genre;
  const lower = req.params.lower;
  const upper = req.params.upper;
  var query = `
    WITH songs_in_time_and_genre AS (
      SELECT DISTINCT b.song_id FROM BillboardAppearance b JOIN Genre g ON b.song_id = g.song_id
      WHERE (${lower} = 1950 OR YEAR(b.week) >= ${lower}) 
        AND (${upper} = 2021 OR YEAR(b.week) <= ${upper})
        AND g.category = '${genre}'
    ),
    lyrics_in_genre AS (
      SELECT h.word, count(h.word) as count FROM HasLyric h JOIN songs_in_time_and_genre st ON h.song_id = st.song_id
      GROUP BY h.word ORDER BY count DESC
    )
    SELECT lg.word, lg.count, l.popularity FROM lyrics_in_genre lg JOIN Lyric l ON lg.word = l.word
    ORDER BY lg.count DESC;
  `;

  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

const genreBillboardInformation = (req, res) => {
  const genre = req.params.genre;
  var query = `
    SELECT DATE_FORMAT(week,'%Y-%m') AS monthYear, count(DATE_FORMAT(week,'%Y-%m')) AS count FROM BillboardAppearance b 
    JOIN Genre g ON b.song_id = g.song_id  
    WHERE g.category = 'rap' GROUP BY monthYear ORDER BY monthYear DESC;
  `;

  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

const genreSongInformation = (req, res) => {
  const genre = req.params.genre;
  const upper = req.params.upper;
  const lower = req.params.lower;
  var query = `
    WITH numOfAppearancesOnBillboard AS ( 
      SELECT b.song_id, COUNT(b.song_id) as num
      FROM BillboardAppearance b JOIN Genre g ON b.song_id = g.song_id
      WHERE g.category = '${genre}' 
        AND (${lower} = 1950 OR YEAR(b.week) >= ${lower}) 
        AND (${upper} = 2021 OR YEAR(b.week) <= ${upper}) 
      GROUP BY b.song_id 
    )
    SELECT n.song_id, p.title, n.num
    FROM numOfAppearancesOnBillboard n JOIN PerformerTitle p ON n.song_id = p.song_id
    ORDER BY n.num DESC;
  `;
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

const genreSummary = (req, res) => {
  const genre = req.params.genre;
  var query = `
    SELECT g.category, AVG(length) AS length, AVG(popularity) AS popularity, AVG(energy) AS energy, 
    AVG(acousticness) AS acousticness, AVG(danceability) AS danceability, AVG(liveness) AS liveness, 
    AVG(loudness) AS loudness, AVG(speechiness) AS speechiness, AVG(tempo) AS tempo, AVG(valence) AS valence
    FROM Genre g JOIN Song s ON g.song_id = s.id WHERE g.category = '${genre}'
    GROUP BY g.category;
  `;
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

module.exports = {
  songOverviewInformation: songOverviewInformation,
  songSimilarSongs: songSimilarSongs,
  songLyricInformation: songLyricInformation,
  songBillboardInformation: songBillboardInformation,
  songGenres: songGenres,
  genreLyricInformation: genreLyricInformation,
  genreBillboardInformation: genreBillboardInformation,
  genreSongInformation: genreSongInformation,
  genreSummary: genreSummary
}