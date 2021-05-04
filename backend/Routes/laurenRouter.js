
var {Router} = require('express')
var router = Router();
const db = require("../db_func/db_lauren")

router.get('/genres/:lim?', db.getGenres);
router.get('/searchData/:lim?/:gen?/:low?/:up?/:pos?/:key?', db.searchEverything);


router.get('/home/query0/:gen?', db.topWordsByGenre);
router.get('/home/query1/:pos?/:low?/:up?', db.topWordsByRankAndTime);
router.get('/home/query2/:low?/:up?', db.topGenresByRankAndTime);
router.get('/home/query3/:low?/:up?', db.topPosOfGenre);

module.exports = router