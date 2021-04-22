const express = require('express')
const bodyParser = require('body-parser')
const PORT = 8080
const arouters = require('./Routes/adarshRouter')
const drouters = require('./Routes/danielRouter')
const jrouters = require('./Routes/jeffreyRouter')
const lrouters = require('./Routes/laurenRouter')

const app = express()

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})