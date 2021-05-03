
var {Router} = require('express')
var router = Router();
const db = require("../db_func/db_lauren")

router.get('/genres', db.getGenres);
router.get('/searchData/:lim?/:gen?/:low?/:up?/:pos?/:key?', db.searchEverything);


module.exports = router