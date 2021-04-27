const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

const PORT = 8080
const arouters = require('./Routes/adarshRouter.js')
const drouters = require('./Routes/danielRouter.js')
const jrouters = require('./Routes/jeffreyRouter.js')
const lrouters = require('./Routes/laurenRouter.js')

const app = express()

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

/**
 * Song page routes
 */
app.get('/songOverview/:songId', arouters.songOverviewInformation);
app.get('/songGenres/:songId', arouters.songGenres);
app.get('/songLyrics/:songId', arouters.songLyricInformation);
app.get('/songSimilar/:songId', arouters.songSimilarSongs);
app.get('/songBillboard/:songId', arouters.songBillboardInformation);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})