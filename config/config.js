
const mongoose = require('mongoose')
require('colors')

const connectDb = async () => {
   try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDb Connected ${conn.connection.host}`.yellow)
   } catch (error) {
     console.log(`Error : ${error.message}`.bgRed)
     process.exit(1)
   }
}

// experts

module.exports = connectDb;