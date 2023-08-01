const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
 require('colors')
 const connectDb = require('./config/config')

//  dotenv config 

dotenv.config()

// db config 
connectDb()

//  rest Object
const app = express()

// middle ware 
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan("dev"))

// routes
app.use('/api/items',  require('./routes/itemRoutes'))
app.use('/api/users',  require('./routes/userRoutes'))
app.use('/api/bills',  require('./routes/billsRoutes'))
app.use('/api/upload',  require('./routes/upload'))
app.use(express.static(path.join(__dirname, "/public")));

// port 

const PORT = process.env.PORT || 8080 
app.listen(PORT, () => {
    console.log(`server running on ${PORT}` .bgCyan.white);
});