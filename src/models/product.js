const mongoose = require('mongoose')
const validator = require('validator')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    in_stock: {
        type: Boolean
    },
    in_stock_quantity: {
        type: Number,
        default: 100,
        validate(value) {
            if(value < 0)
                throw new Error('In-Stock quantity must be greater than zero')
        }
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product