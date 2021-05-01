const connection = require('../config')


// methods for artist and lyrics
// ----------------------------- ARTIST METHODS --------------------------

// get artist information like 
// - most frequent genres
// - number of songs in database

const artistInfo = (req, res) => {

}

const artistGenres = (req, res) => {
  const artist = req.params.artistName.toLowerCase();
  const query = `
  
  `
}


// get top songs (top determined by peak position)
const topSongs = (req, res) => {
  const artist = req.params.artistName.toLowerCase();
  console.log(artist)
  const query = `
  WITH Billboard AS (SELECT song_id, peak_position, weeks_on_chart FROM BillboardAppearance)
  SELECT p.title, MIN(IF(b.peak_position = 0, 999999, b.peak_position)) as peak, MAX(IF(b.weeks_on_chart=0, -1, b.weeks_on_chart)) as weeks 
    FROM PerformerTitle p JOIN Billboard b ON p.song_id=b.song_id
    WHERE LOWER(p.performer) = '${artist}'
    GROUP BY p.title
    ORDER BY peak ASC, weeks DESC;
  `
  connection.query(query, (err, rows, fields) => {
    if  (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

module.exports = {
  topSongs: topSongs
}