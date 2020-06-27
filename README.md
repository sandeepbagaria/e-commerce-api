## Folder Structure

```
e-commerce/
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
```

- `src/index.js` is the entry point.

- Set environment variables in `e-commerce/config/dev.env` file as mentioned in the folder structure above.

- Environment variables is sensitive data and should not be exposed, but as it is currently working on local machine, I am showing what environment variables you may set in `config/dev.env` file.
```
PORT=3001
MONGODB_URL=mongodb://127.0.0.1:27017/e-commerce-api
JWT_SECRET_KEY=thisisnodejscourse
```
- Also set different environment variables in `config/test.env` file for test script to use a different database.

## Installing all dependency
>Run `npm install` to install all dependencies first

## Available Scripts

In the project directory you can run the project by:-
```
'npm run start'
Runs the app in devlopment mode

'npm run dev'
Runs the app in development mode with nodemon

'npm run test'
Launches test runner in watchAll mode
```

## URL
>Base URL
http://localhost:3001/api/
```
Use `POSTMAN` as API client to create and save http requests and also to read their responses.
Use `mongoDB` for database, run `/mongodb/bin/mongod.exe` to set mongoDB server first with correct --dbpath.
Use `Robo-3T` or `mongoDB-compass` for better UI of datatbase as a client.
```
## Request URLs from POSTMAN
>Base URL

http://localhost:3001/api/
```
1) Create User
    URL: /users
    Method: POST
```
```
2) Login User
    URL: /users/login
    Method: POST
```
```
3) Logout User
    URL: /users/logout
    Method: POST
```
```
4) Read Profile
    URL: /users/me
    Method: GET
```
```
5) Update User Details
    URL: /users/me
    Method: PATCH
```
```
6) Delete User
    URL: /users/me
    Method: DELETE
```
```
7) Create Product
    URL: /products
    Method: POST
```
```
8) Read Product
    URL: /products
    Method: GET
```
```
9) Update Product
    URL: /products/:productID
    Method: PATCH
```
```
10) Delete Product
    URL: /products/:productID
    Method: DELETE
```
```
11) Add to Cart
    URL: /users/addToCart/:productID
    Method: POST
```
```
12) View Cart
    URL: /users/viewCart
    Method: GET
```
```
13) Remove from Cart
    URL: /users/removeFromCart/:productID
    Method: POST
```
```
14) Clear Cart
    URL: /users/clearCart
    Method: POST
```
```
15) Get cart total quantity and price
    URL: /users/cartTotal
    Method: GET
```
```
16) Place Order
    URL: /users/placeOrder
    Method: POST
```
```
17) Get Orders
    URL: /users/orders
    Method: GET
```