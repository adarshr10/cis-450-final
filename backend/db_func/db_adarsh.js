const connection = require('../config')

const songBillboardInformation = (req, res) => {
  const songId = req.params.songId.replace("'", "\\'");
  var query = `
    SELECT week, position FROM BillboardAppearance b
    WHERE b.song_id = '${songId}'
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
    FROM Song s JOIN PerformerTitle p ON s.id = p.song_id
    WHERE s.id = '${songId}'
  `;
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

const songGenres = (req, res) => {
  const songId = req.params.songId.replace("'", "\\'");
  var query = `
    SELECT DISTINCT g.category 
    FROM Song s JOIN Genre g ON s.id = g.song_id
    WHERE s.id = '${songId}'
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
    WHERE h.song_id = '${songId}' ORDER BY h.count DESC
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



const genreLyricInformation = (req, res) => {
  const genre = req.params.genre;
  var query = `
    WITH songs_in_genre AS (
      SELECT s.id FROM Genre g JOIN Song s ON g.song_id = s.id WHERE g.category = '${genre}'
    )
    SELECT h.word, count(h.word) as count FROM HasLyric h JOIN songs_in_genre sg ON h.song_id = sg.id GROUP BY h.word
    ORDER BY count DESC;
  `;
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

const genreSongInformation = (req, res) => {
  const genre = req.params.genre;
  var query = `
    SELECT b.week, count(b.week) FROM BillboardAppearance b 
    JOIN Genre g ON b.song_id = g.song_id  
    WHERE g.category = '${genre}' GROUP BY b.week;
  `;

  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

const genreBillboardInformation = (req, res) => {
  const genre = req.params.genre;
  var query = `
    WITH numOfAppearancesInRange AS ( 
      SELECT b.song_id, COUNT(b.song_id) as num
      FROM BillboardAppearance b JOIN Genre g ON b.song_id = g.song_id
      WHERE g.category = '${genre}' GROUP BY b.song_id
    )
    SELECT p.title, n.num
    FROM numOfAppearancesInRange n JOIN PerformerTitle p ON n.song_id = p.song_id
    ORDER BY n.num DESC;
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
  songGenres: songGenres
}