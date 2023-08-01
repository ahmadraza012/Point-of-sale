const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
    },
    priceCartoons: {
        type: Number,
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        // default: `${publicPics}/artist.svg`,
        // required: trues
    },
    quantity:{
        type: Number,
        required: true
    },
    CartoonsQuantity:{
        type: Number,
        required: true
    },
    discount: {
        type: Number,
    }
},
{timestamp: true}

);

const Items = mongoose.model("Items", itemSchema)

module.exports = Items