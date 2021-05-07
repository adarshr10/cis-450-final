
var {Router} = require('express')
var router = Router();
const db = require("../db_func/db_search")

router.get('/genres/:lim?', db.getGenres);
router.get('/searchData/:lim?/:gen?/:low?/:up?/:pos?/:key?', db.searchEverything);


router.get('/home/topWordsByGenre/:gen?', db.topWordsByGenre);
router.get('/home/topWordsByRankAndTime/:pos?/:low?/:up?', db.topWordsByRankAndTime);
router.get('/home/topGenresByRankAndTime/:low?/:up?', db.topGenresByRankAndTime);
router.get('/home/topPosOfGenre/:low?/:up?', db.topPosOfGenre);

module.exports = router