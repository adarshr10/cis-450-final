var {Router} = require('express')
var router = Router();
const db = require('../db_func/db_jeff')

router.get("/artist/topSongs/:artistName", (req, res) => db.topSongs(req, res, 100));
router.get("/artist/artistGenres/:artistName", db.artistGenres);
router.get("/artist/topLyrics/:artistName", (req, res) => db.topLyrics(req, res, 100))
router.get("/artist/similarArtists/:artistName", (req, res) => db.similarArtists(req, res, 30))
router.get("/artist/billboardPerformance/:artistName", db.billboardPerformance)


router.get('/lyric/topGenres/:lyric', (req, res) => db.lyricTopGenre(req, res, 30))
router.get('/lyric/topArtists/:lyric', (req, res) => db.lyricTopArtist(req, res, 30))
router.get('/lyric/topSongs/:lyric', (req, res) => db.lyricTopSongs(req, res, 30))
router.get('/lyric/billboardPlot/:lyric', (req, res) => db.lyricBillboard(req, res, 30))


module.exports = router