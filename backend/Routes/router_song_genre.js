
var {Router} = require('express')
var router = Router();
const db = require('../db_func/db_song_genre')

router.get('/songOverview/:songId', db.songOverviewInformation);
router.get('/songGenres/:songId', db.songGenres);
router.get('/songLyrics/:songId', db.songLyricInformation);
router.get('/songSimilar/:songId', db.songSimilarSongs);
router.get('/songBillboard/:songId', db.songBillboardInformation);
router.get('/genreLyrics/:genre/:lower/:upper', db.genreLyricInformation);
router.get('/genreBillboard/:genre', db.genreBillboardInformation);
router.get('/genreSongs/:genre/:lower/:upper', db.genreSongInformation);
router.get('/genreOverview/:genre', db.genreSummary);
router.get('/genrePopularArtists/:genre', db.genrePopularArtists);
module.exports = router
