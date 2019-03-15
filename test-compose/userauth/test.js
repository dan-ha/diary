'use strict'

const assert = require('chai').assert;
const request = require('supertest')(process.env.URL_USERS_TEST);
const util = require('util');
const url = require('url');
const URL = url.URL;

const authUser = 'them';
const authKey = 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF';

describe("Users Test", function() {
    
    beforeEach(async function() {
        await request.post('/create-user')
            .send({
                username: "test",
                password: "t3st",
                provider: "local",
                familyName: "family",
                givenName: "given",
                middleName: "",
                emails: [],
                photos: []
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .auth(authUser, authKey);
    });

    afterEach(async function() {
        await request.delete('/destroy/test')
            .set('Content-Type', 'application-json')
            .set('Accept', 'application/json')
            .auth(authUser, authKey);
    });

    describe("List user", function() {
        it("list created users", async function() {
            const res = await request.get('/list')
                .set('Content-Type', 'application-json')
                .set('Accept', 'application/json')
                .auth(authUser, authKey);
            assert.exists(res.body);
            assert.isArray(res.body);
            assert.lengthOf(res.body, 1);
            assert.deepEqual(res.body[0], {
                id: "test",
                username: "test",
                provider: "local",
                familyName: "family",
                givenName: "given",
                middleName: "",
                emails: [],
                photos: []
            });
        });
    });

    describe("find user", function() {
        it("find created user", async function() {
            const res = await request.get('/find/test')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .auth(authUser, authKey);
            assert.exists(res.body);
            assert.isObject(res.body);
            assert.deepEqual(res.body, {
                id: "test",
                username: "test",
                provider: "local",
                familyName: "family",
                givenName: "given",
                middleName: "",
                emails: [],
                photos: []
            });
        });
        it("fail to find non-existent users", async function() {
            var res;
            try {
                res = await request.get('/find/nonExistingUser')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .auth(authUser, authKey);
            } catch(err) {
                return; // Test is okay in this case
            }
            assert.exists(res.body);
            assert.isObject(res.body);
            assert.deepEqual(res.body, {});
        });
    });

    describe("delete user", function() {
        it("delete nonexisting user", async function() {
            var res;
            try{
                res = await request.delete('/destroy/nonExistingUser')
                    .set('Content-type', 'application/json')
                    .set('Accept', 'application/json')
                    .auth(authUser, authKey);
            } catch(err) {
                return; // Test is okay in this case
            }
            assert.exists(res);
            assert.exists(res.error);
            assert.notEqual(res.status, 200);
        });
    });
});