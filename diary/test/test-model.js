'use strict'

// This will replace standard require function with one from esm
// that is able to lead ES6 modules
require = require("@std/esm")(module, { "esm": "js" });
const assert = require('chai').assert;
const model = require('../models/entries');

describe("Model Test", function () {

    beforeEach(async function () {
        try {
            const dates = await model.datelist();
            for (let date of dates) {
                await model.destroy(date);
            }
            await model.create("01/01/2019", "Title 1", "Content 1");
            await model.create("02/01/2019", "Title 2", "Content 2");
            await model.create("03/01/2019", "Title 3", "Content 3");
        } catch (e) {
            console.error(e);
            throw e;
        }
    });

    describe("check datelist", function () {
        it("should have three entries", async function () {
            const dates = await model.datelist();
            assert.exists(dates);
            assert.isArray(dates);
            assert.lengthOf(dates, 3);
        });
        it("should have specified dates", async function () {
            const dates = await model.datelist();
            assert.exists(dates);
            assert.isArray(dates);
            assert.lengthOf(dates, 3);
            for (let date of dates) {
                assert.match(date, /0[1,2,3]\/01\/2019/, "correct date");
            }
        });
        it("should have titles Title #", async function () {
            const dates = await model.datelist();
            assert.exists(dates);
            assert.isArray(dates);
            assert.lengthOf(dates, 3);
            var entryPromises = dates.map(date => model.read(date));
            const entries = await Promise.all(entryPromises);
            for (let entry of entries) {
                assert.match(entry.title, /Title [1,2,3]/, "correct title");
            }
        });
    });

    describe("read entry", function () {
        it("should have proper entry", async function () {
            const entry = await model.read("01/01/2019");
            assert.exists(entry);
            assert.deepEqual({ date: entry.date, title: entry.title, content: entry.content },
                { date: "01/01/2019", title: "Title 1", content: "Content 1" });
        });
        it("Unknown entry should fail", async function () {
            try {
                const entry = await model.read("unknown date");
                throw new Error("should not get here");
            } catch (err) {
                // this is expected, so do not indicate error
                assert.notEqual(err.message, "should not get here");
            }
        })
    });

    describe("update entry", function () {
        it("after a successful model.update", async function () {
            const newentry = await model.update("01/01/2019", "Title 1 changed", "Content 1 changed");
            const entry = await model.read("01/01/2019");
            assert.exists(entry);
            assert.deepEqual({ date: entry.date, title: entry.title, content: entry.content }, {
                date: "01/01/2019", title: "Title 1 changed", content: "Content 1 changed"
            });
        });
    });

    describe("destroy entry", function () {
        it("should remove entry", async function () {
            await model.destroy("01/01/2019");
            const dates = await model.datelist();
            assert.exists(dates);
            assert.isArray(dates);
            assert.lengthOf(dates, 2);
            for (let date of dates) {
                assert.match(date, /0[2,3]\/01\/2019/, "correct key");
            }
        });
        if ("should fail to remove unknown entry", async function () {
            try {
                await model.destroy("unknown date");
                throw new Error("should not get here");
            } catch (err) {
                assert.notEqual(err.message, "should not get here");
            }
        });
    });

    after(function () {
        model.close();
    });
});