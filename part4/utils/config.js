require('dotenv').config()

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/part4'

module.exports = { MONGODB_URI, PORT }
