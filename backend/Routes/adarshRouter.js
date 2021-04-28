
var {Router} = require('express')
var router = Router();
const db = require('../db_func/db_adarsh')

router.get('/songOverview/:songId', db.songOverviewInformation);
router.get('/songGenres/:songId', db.songGenres);
router.get('/songLyrics/:songId', db.songLyricInformation);
router.get('/songSimilar/:songId', db.songSimilarSongs);
router.get('/songBillboard/:songId', db.songBillboardInformation);

module.exports = router
