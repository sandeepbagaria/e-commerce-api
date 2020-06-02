const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const testUserId = new mongoose.Types.ObjectId()
const testUser = {
    _id: testUserId,
    name: 'test',
    phone_no: 754385,
    email: 'test@test.com',
    password: 'test12345',
    tokens: [{
        token: jwt.sign({_id: testUserId}, process.env.JWT_SECRET_KEY)
    }]
}

beforeEach(async () => {
 await User.deleteMany({})
 await new User(testUser).save()
})

test('Register/Signup a user', async () => {
    await request(app).post('/api/users').send({
        name: 'Sandeep',
        phone_no: 64873264,
        email: 'sandeep@gmail.com',
        password: 'sandeep123'
    }).expect(201)
})

test('Login existing user with right credentials', async () => {
    await request(app).post('/api/users/login').send({
        email: 'test@test.com',
        password: 'test12345'
    }).expect(200)
})

test('Login existing user with wrong credentials', async () => {
    await request(app).post('/api/users/login').send({
        email: 'test@gmail.com',
        password: 'test1234'
    }).expect(400)
})

test('Get user profile', async () => {
    await request(app)
    .get('/api/users/me')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Do not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/api/users/me')
    .send()
    .expect(401)
})

test('Delete account for authenticated user', async () => {
    await request(app)
    .delete('/api/users/me')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Delete account for un-authenticated user', async () => {
    await request(app)
    .delete('/api/users/me')
    .send()
    .expect(401)
})