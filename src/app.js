const express = require('express')
var cors = require('cors')
require('./db/mongoose')
const userRouter = require('./routers/user')
const productRouter = require('./routers/product')

const app = express()
app.use(cors())

app.use(express.json())
app.use(userRouter)
app.use(productRouter)

module.exports = app