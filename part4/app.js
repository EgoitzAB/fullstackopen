const config = require('./utils/config')
const express = require('express')
/* default in express 5 require('express-async-errors') */

const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

// Routers
const blogsRouter = require('./controllers/blogs')     // ← NUEVO
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')     // ← NUEVO
// Utils
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) => logger.error('error connecting to MongoDB:', error.message))

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

// Monta RUTAS
app.use('/api/blogs', blogsRouter)   // ← requerido para 4.2 (blogs)
app.use('/api/users', usersRouter)   // ← requerido para 4.3 (users)
app.use('/api/login', loginRouter)   // ← requerido para 4.3 (login)

// Middlewares finales
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
