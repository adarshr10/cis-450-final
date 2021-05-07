const express = require('express')
// const bodyParser = require('body-parser')
const cors = require('cors');

const PORT = 8080
const router_song_genre = require('./Routes/router_song_genre.js')
const router_artist_lyric = require('./Routes/router_artist_lyric.js')
const router_search = require('./Routes/router_search.js')

const app = express()

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(router_artist_lyric);
app.use(router_search);
app.use(router_song_genre);


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})