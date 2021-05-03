
var {Router} = require('express')
var router = Router();
const db = require('../db_func/db_adarsh')

router.get('/songOverview/:songId', db.songOverviewInformation);
router.get('/songGenres/:songId', db.songGenres);
router.get('/songLyrics/:songId', db.songLyricInformation);
router.get('/songSimilar/:songId', db.songSimilarSongs);
router.get('/songBillboard/:songId', db.songBillboardInformation);
router.get('/genreLyrics/:genre', db.genreLyricInformation);
router.get('/genreBillboard/:genre', db.genreBillboardInformation);
router.get('/genreSongs/:genre', db.genreSongInformation);
router.get('/genreOverview/:genre', db.genreSummary);
module.exports = router
