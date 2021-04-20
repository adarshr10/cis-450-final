const express = require('express')
const bodyParser = require('body-parser')
const PORT = 8080
const arouters = require('adarshRouter')
const drouters = require('danielRouter')
const jrouters = require('jeffreyRouter')
const lrouters = require('laurenRouter')

const app = express()

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})