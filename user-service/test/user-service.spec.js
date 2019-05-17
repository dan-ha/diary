'use strict'
// replace require, so we can use .mjs
require = require("@std/esm")(module, { "esm": "js" });
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server');

const ADDRESS = process.env.ADDRESS;
const PORT = process.env.PORT;
const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

const user = {
    username: 'testUsername',
    password: 'testPassword',
    name: 'testName',
    email: 'testEmail'
}

describe('User service', () => {
    describe('Create new User - POST /user', () => {
        it('should return 401 for unauthorized request', async () => {
            return chai
                .request(`${ADDRESS}:${PORT}`)
                .post('/user')
                .send(user)
                .then(res => {
                    chai.expect(res.status).to.be.equal(401);
                });
        });
        it('should sucesfully create new user', async () => {
            return chai
                .request(`${ADDRESS}:${PORT}`)
                .post('/user')
                .auth(AUTH_USERNAME, AUTH_PASSWORD)
                .send(user)
                .then(res => {
                    chai.expect(res.status).to.be.equal(201);
                    chai.expect(res.body.username).to.be.equal(user.username);
                    chai.expect(res.body.password).not.to.be.equal(user.password);
                    chai.expect(res.body.name).to.be.equal(user.name);
                    chai.expect(res.body.email).to.be.equal(user.email);
                });
        });
        it('should return 409 for duplicate username', async () => {
            return chai
                .request(`${ADDRESS}:${PORT}`)
                .post('/user')
                .auth(AUTH_USERNAME, AUTH_PASSWORD)
                .send(user)
                .then(res => {
                    chai.expect(res.status).to.be.equal(409);
                });
        });
        it('should return 500 for invalid user', async () => {
            return chai
                .request(`${ADDRESS}:${PORT}`)
                .post('/user')
                .auth(AUTH_USERNAME, AUTH_PASSWORD)
                .send({ password: 'password' })
                .then(res => {
                    chai.expect(res.status).to.be.equal(500);
                });
        });
    });

    describe('Get user - GET /user/:username', () => {
        it('should return 401 for unauthorized request', async () => {
            return chai
                .request(`${ADDRESS}:${PORT}`)
                .get(`/user/${user.username}`)
                .then(res => {
                    chai.expect(res.status).to.be.equal(401);
                })
        });
        it('should get user', async () => {
            return chai
                .request(`${ADDRESS}:${PORT}`)
                .get(`/user/${user.username}`)
                .auth(AUTH_USERNAME, AUTH_PASSWORD)
                .then(res => {
                    chai.expect(res.status).to.be.equal(200);
                    chai.expect(res.body.username).to.be.equal(user.username);
                    chai.expect(res.body.password).not.to.be.equal(user.password);
                    chai.expect(res.body.name).to.be.equal(user.name);
                    chai.expect(res.body.email).to.be.equal(user.email);
                });
        });
        it('should return 404 for non existing user', async () => {
            return chai
                .request(`${ADDRESS}:${PORT}`)
                .get(`/user/nonExistingUsername`)
                .auth(AUTH_USERNAME, AUTH_PASSWORD)
                .then(res => {
                    chai.expect(res.status).to.be.equal(404);
                });
        });
    });

    describe('PasswordCheck - POST /passwordCheck', () => {
        it('should return 401 for unauthorized request', async () => {
            return chai
                .request(`${ADDRESS}:${PORT}`)
                .post(`/passwordCheck`)
                .then(res => {
                    chai.expect(res.status).to.be.equal(401);
                });
        });
        it('should successfully authenticate user', async () => {
            return chai
                .request(`${ADDRESS}:${PORT}`)
                .post(`/passwordCheck`)
                .auth(AUTH_USERNAME, AUTH_PASSWORD)
                .send({ username: user.username, password: user.password })
                .then(res => {
                    chai.expect(res.status).to.be.equal(200);
                    chai.expect(res.body.status).to.be.equal(true)
                });
        });
        it('should return false - wrong password', async () => {
            return chai
                .request(`${ADDRESS}:${PORT}`)
                .post(`/passwordCheck`)
                .auth(AUTH_USERNAME, AUTH_PASSWORD)
                .send({ username: user.username, password: 'wrongPassword' })
                .then(res => {
                    chai.expect(res.status).to.be.equal(200);
                    chai.expect(res.body.status).to.be.equal(false)
                });
        });
        it('should return 404 for non-existing user', async () => {
            return chai
                .request(`${ADDRESS}:${PORT}`)
                .post(`/passwordCheck`)
                .auth(AUTH_USERNAME, AUTH_PASSWORD)
                .send({ username: 'nonExistingUser', password: 'wrongPassword' })
                .then(res => {
                    chai.expect(res.status).to.be.equal(404);
                });
        });
    });
});