## Folder Structure

>e-commerce/
    config/
        dev.env
        test.env
    node_modules/
    src/
        db/
            mongoose.js
        middleware/
            auth.js
        models/
            product.js
            user.js
        routers/
            product.js
            user.js
        app.js
        index.js
        tests/
            user.test.js
        package-lock.json
        package.json
        README.md

> `src/index.js` is the entry point

## Available Scripts

In the project directory you can run the project by:-

### 'npm run start'
>Runs the app in devlopment mode

### 'npm run dev'
>Runs the app in development mode with nodemon

### 'npm run test'
>Launches test runner in watchAll mode

## Installing all dependency
>Run `npm install` to install all dependencies first

## URL
>Base URL
http://localhost:3000/api/

>Use `POSTMAN` as API client to create and save http requests and also to read their responses.
>Use `mongoDB` for database, run `/mongodb/bin/mongod.exe` to set mongoDB server first with correct --dbpath.
>Use `Robo-3T` or `mongoDB-compass` for better UI of datatbase as a client.

## Request URLs from POSTMAN
>Base URL
http://localhost:3000/api/

1) Create User
    URL: /users
    Method: POST

2) Login User
    URL: /users/login
    Method: POST

3) Logout User
    URL: /users/logout
    Method: POST

4) Read Profile
    URL: /users/me
    Method: GET

5) Update User Details
    URL: /users/me
    Method: PATCH

6) Delete User
    URL: /users/me
    Method: DELETE

7) Create Product
    URL: /products
    Method: POST

8) Read Product
    URL: /products
    Method: GET

9) Update Product
    URL: /products/:productID
    Method: PATCH

10) Delete Product
    URL: /products/:productID
    Method: DELETE

11) Add to Cart
    URL: /users/addToCart/:productID
    Method: POST

12) View Cart
    URL: /users/viewCart
    Method: GET

13) Remove from Cart
    URL: /users/removeFromCart/:productID
    Method: POST

14) Clear Cart
    URL: /users/clearCart
    Method: POST

## In Users Model
- Cart and orders for a user are maintained in users collection
- If orders.isProcessed === true, It's a past order product
- If orders.isProcessed === false, It's a cart product
So, routes validations as per processed orders and un-processed orders are remaining for maintaining Past orders.