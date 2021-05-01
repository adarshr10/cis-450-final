var express = require('express')
var router = express.Router();
const db = require('../db_func/db_jeff')

router.get("/artist/:artistName", db.topSongs);















module.exports = router