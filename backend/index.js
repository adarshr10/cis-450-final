const express = require('express')
// const bodyParser = require('body-parser')
const cors = require('cors');

const PORT = 8080
const arouters = require('./Routes/adarshRouter.js')
const drouters = require('./Routes/danielRouter.js')
const jrouters = require('./Routes/jeffreyRouter.js')
const lrouters = require('./Routes/laurenRouter.js')

const app = express()

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(arouters);
app.use(lrouters);
app.use(jrouters);
app.use(drouters);





app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})