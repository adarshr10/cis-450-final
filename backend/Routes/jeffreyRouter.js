var {Router} = require('express')
var router = Router();
const db = require('../db_func/db_jeff')

router.get("/artist/topSongs/:artistName", (req, res) => db.topSongs(req, res, 100));
router.get("/artist/artistGenres/:artistName", db.artistGenres);
router.get("/artist/topLyrics/:artistName", (req, res) => db.topLyrics(req, res, 30))
router.get("/artist/similarArtists/:artistName", (req, res) => db.similarArtists(req, res, 30))
router.get("/artist/billboardPerformance/:artistName", db.billboardPerformance)
















module.exports = router