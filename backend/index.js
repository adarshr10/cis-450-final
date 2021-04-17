const express = require('express')
const bodyParser = require('body-parser')
const PORT = 8080

const app = express()

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})