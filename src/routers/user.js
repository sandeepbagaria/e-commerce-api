const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const Product = require('../models/product')

router.post('/api/users', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user , token })
    } catch (e) {
        res.status(400).send(e)
    }
    // user.save().then((result) => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})  //token is used to set environment variable in postman
    } catch (e) {
        res.status(400).send({ error: 'Unable to login!' })
    }
})

router.post('/api/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        req.user.save()
        res.send()
    } catch (e) {
        res.send(500).send()
    }
})

router.post('/api/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/api/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/api/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "phone_no", "password"]
    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidUpdate)
    {
        return res.status(400).send({error: 'Invalid Update!'})
    }

    try {
        updates.forEach((key) => {
            req.user[key] = req.body[key]
        })
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.delete('/api/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// orders where isProcessed is false are only counted in cart
// And orders where isProcessed is true are past orders
router.post('/api/users/addToCart/:id', auth, async (req, res) => {
    const product = await Product.findById(req.params.id)

   try {

    if(!product) {
        return res.status(400).send({error: 'Invalid object!'})
    }

    if(product.in_stock) {

        var key = 0
        const isAvailableInCartArray = req.user.orders.find((product) => {
            key++
            return (product.product == req.params.id) && (!product.isProcessed)
        })
        key--
    
        if(!isAvailableInCartArray) {
            req.user.orders = req.user.orders.concat({
            product: req.params.id,
            quantity: 1,
            price: product.price,
            name: product.name
            })
            product.in_stock_quantity = product.in_stock_quantity - 1
        } else if(!req.user.orders[key].isProcessed){
            req.user.orders[key].quantity = req.user.orders[key].quantity + 1 
            req.user.orders[key].price = product.price * req.user.orders[key].quantity
            product.in_stock_quantity = product.in_stock_quantity - 1
        } else {
            req.user.orders = req.user.orders.concat({
            product: req.params.id,
            quantity: 1,
            price: product.price,
            name: product.name
            })
            product.in_stock_quantity = product.in_stock_quantity - 1            
        }
    } else {
        return res.send({error: 'Stock Unavailable!'})
    }
    
    req.user.save()
    product.save()
    res.send(req.user)
   } catch (e) {
    res.status(500).send(e)
   }
})

router.get('/api/users/viewCart', auth, async (req, res) => {
    try {
        const cart = req.user.orders.filter((order) => {
            return !order.isProcessed
        })
        res.send(cart)
    } catch (e) {
        res.send(500).send()
    }
})

router.get('/api/users/cartTotal', auth, async (req, res) => {
    try {
        console.log(req.user.orders)
        const totalQuantityArray = req.user.orders.map((product) => {
            if(!product.isProcessed) {
            return product.quantity
            } else {
                return 0;
            }
        })
        const totalPriceArray = req.user.orders.map((product) => {
            if(!product.isProcessed) {
                return product.price
                } else {
                    return 0;
                }
        })
        console.log(totalPriceArray)
        let sum = 0
        let price = 0
        for(let i=0; i<totalQuantityArray.length; i++) {
            sum = sum + totalQuantityArray[i]
        }
        for(let j=0; j<totalPriceArray.length; j++) {
            price = price + totalPriceArray[j]
        }
        console.log(price)
        res.send({
            sum,
            price
        })
    } catch (e) {
        res.send(500).send()
    }
})

router.post('/api/users/removeFromCart/:id', auth, async (req, res) => {
    const product = await Product.findById(req.params.id)
    
    try {
        var key = -1
        const isAvailableInCart = req.user.orders.find((product) => {
            key++
            return (product.product == req.params.id) && (!product.isProcessed)
        })

        if(!isAvailableInCart) {
            res.status(404).send({error: 'Product not found in the cart!'})
        } else {

            req.user.orders[key].quantity = req.user.orders[key].quantity - 1
            req.user.orders[key].price = product.price * req.user.orders[key].quantity
            
            if(req.user.orders[key].quantity == 0) {
                req.user.orders = req.user.orders.filter((product) => {
                    return product.product != req.params.id
                })
            }
            
        }

        req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/api/users/placeOrder', auth, async(req, res) => {
    try {
        console.log(req.body.name)

        const totalPriceArray = req.user.orders.map((product) => {
            if(!product.isProcessed) {
                return product.price
                } else {
                    return 0;
                }
        })
        let price = 0
        for(let j=0; j<totalPriceArray.length; j++) {
            price = price + totalPriceArray[j]
        }

        const totalQuantityArray = req.user.orders.map((product) => {
            if(!product.isProcessed) {
            return product.quantity
            } else {
                return 0;
            }
        })
        let sum = 0
        for(let i=0; i<totalQuantityArray.length; i++) {
            sum = sum + totalQuantityArray[i]
        }
        const cart = req.user.orders.filter((order) => {
            return !order.isProcessed
        })
        
        const updatedCart = cart.map((product) => {
            product.isProcessed = true;
            return {...product}
        })
        
        req.user.processedOrder = req.user.processedOrder.concat({
            totalPrice: price,
            totalQuantity: sum,
            products: cart,
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            pinCode: req.body.pinCode
        })
        req.user.save()
        res.send(req.user)
    } catch (e) {
        res.send(500).send()
    }
})

router.get('/api/users/orders', auth, async (req, res) => {
    try {
        res.send(req.user.processedOrder)        
    } catch (e) {
        res.send(500).send()        
    }
})


router.post('/api/users/clearCart', auth, async (req, res) => {
    try {
        const orders = req.user.orders.filter((order) => {
            return order.isProcessed
        })
        req.user.orders = orders
        req.user.save()
        res.send()
    } catch (e) {
        res.send(500).send()
    }
    
})
module.exports = router