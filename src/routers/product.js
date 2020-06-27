const express = require('express')
const router = new express.Router()
const Product = require('../models/product')

// create product
router.post('/api/products', async (req, res) => {
    const product = new Product(req.body)
    try {
        await product.save()
        res.status(201).send(product)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /products
// GET /products?category='Fruits'
router.get('/api/products', async (req, res) => {
    
    try {
        if(req.query.category) {
            const products = await Product.find({category: req.query.category})
            if(products.length == 0) {
                res.status(404).send({error: 'Invalid Category!'})
            }
            res.send(products)
        }
        const products = await Product.find({})
        res.send(products)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.send(product)
    } catch (e) {
        res.status(500).send(e)
    }
})

// update product by Id
router.patch('/api/products/:id', async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "description", "price", "category", "in_stock", "in_stock_quantity"]
    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidUpdate)
    {
        return res.status(400).send({error: 'Invalid Update!'})
    }

    try {
        const product = await Product.findById(req.params.id)
        updates.forEach((key) => {
            product[key] = req.body[key]
        })
        await product.save()

        res.send(product)
    } catch (e) {
        res.status(400).send(e)
    }

})

// delete product by Id
router.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if(!product) {
            res.status(404).send({error: 'Product does not exist!'})
        }
        res.send(product)
    } catch (e) {
        res.status(500).send(e)
    }

})

module.exports = router