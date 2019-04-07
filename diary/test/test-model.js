'use strict'

// This will replace standard require function with one from esm
// that is able to lead ES6 modules
require = require("@std/esm")(module, { "esm": "js" });
const assert = require('chai').assert;
const model = require('../models/entries');

describe('Model test', function () {

    const username1 = 'test-user';
    const date1 = new Date(2019, 1, 1).valueOf();
    const title1 = 'Model test title1';
    const content1 = 'Model test content1';

    const date2 = new Date(2019, 1, 2).valueOf();
    const title2 = 'Model test title2';
    const content2 = 'Model test content2';

    beforeEach(async function () {
        try {
            // remove all diary entries
            var entries = await model.findAllEntriesDates(username1);
            entries.forEach(async function(entry) {
                await model.deleteEntry(username1, entry.date);
            });
            // insert 2 new test entries
            await model.saveEntry(username1, date1, title1, content1);
            await model.saveEntry(username1, date2, title2, content2);
        } catch (err) {
            console.error(err);
            throw err;
        }
    });

    describe('Save diary entry', function () {
        const date = new Date().setHours(0, 0, 0, 0).valueOf();

        it('should save new Entry', async function () {
            // Arrange
            const title = 'Test-mongoose create entry';
            const content = 'Test-mongoose should create new entry document';

            // Act
            await model.saveEntry(username1, date, title, content);

            // Assert
            const newEntry = await model.findEntry(username1, date);
            assert.equal(newEntry.username, username1);
            assert.equal(newEntry.date, date);
            assert.equal(newEntry.title, title);
            assert.equal(newEntry.content, content);
        });

        it('should fail to save duplicate entry', async function () {
            // Arrange
            const errorMessage = 'should not get here';
            // Act
            try {
                await model.saveEntry(username1, date1, 'Test title', 'Test content');
                throw new Error('should not get here');
            }
            // Assert
            catch (error) {
                assert.notEqual(error.message, errorMessage);
            }
        });
    });

    describe('Find diary entry', function () {
        it('should find existing entry', async function () {
            // Arrange

            // Act
            var entry = await model.findEntry(username1, date1);

            // Assert
            assert.equal(entry.username, username1);
            assert.equal(entry.date, date1);
            assert.equal(entry.title, title1);
            assert.equal(entry.content, content1);
        });

        it('should return null for non existing entry', async function () {
            // Arrange

            // Act
            var entry = await model.findEntry('non-existing', 123);

            // Assert
            assert.isNull(entry);
        });
    });

    describe('Find all entries dates', function () {
        it('should find 2 entries', async function () {
            // Arrange

            // Act
            var entries = await model.findAllEntriesDates(username1);

            // Assert
            assert.exists(entries);
            assert.isArray(entries);
            assert.lengthOf(entries, 2);
            assert.equal(entries[0].date, date2);
            assert.equal(entries[1].date, date1);
        });

        it('should return empty array', async function () {
            // Arrange
            const username = 'non-existing';
            // Act
            var entries = await model.findAllEntriesDates(username);

            // Assert
            assert.exists(entries);
            assert.isArray(entries);
            assert.lengthOf(entries, 0);
        });
    });


    describe('Update an entry', function () {
        it('should update existing entry', async function () {
            // Arrange
            const newTitle = 'Model test new title1';
            const newContent = 'Model test update new content1';

            // Act
            const result = await model.updateEntry(username1, date1, newTitle, newContent);

            // Assert
            assert.isTrue(result);

            var updatedEntry = await model.findEntry(username1, date1);
            assert.equal(updatedEntry.username, username1);
            assert.equal(updatedEntry.date, date1);
            assert.equal(updatedEntry.title, newTitle);
            assert.equal(updatedEntry.content, newContent);
        });

        it('should return true for same object', async function () {
            // Arrange
            // Act
            const result = await model.updateEntry(username1, date2, title2, content2);

            // Assert
            assert.isTrue(result);
        });

        it('should return false for non exisitng entry', async function () {
            // Arrange
            // Act
            const result = await model.updateEntry(username1, new Date().valueOf(), 'new title', 'new content');

            // Assert
            assert.isFalse(result);
        });
    });

    describe('Delete an entry', function () {
        it('should remove entry', async function () {
            // Arrange
            // Act
            var response = await model.deleteEntry(username1, date2);

            // Assert
            assert.isTrue(response);

            var entries = await model.findAllEntries(username1);
            assert.isArray(entries);
            assert.lengthOf(entries, 1);
            assert.equal(entries[0].date, date1);
        });

        it('should return false for non existing entry', async function () {
            // Arrange
            var date = new Date().valueOf();
            // Act
            var response = await model.deleteEntry(username1, date);

            // Assert
            assert.isFalse(response);

            var entries = await model.findAllEntries(username1);
            assert.isArray(entries);
            assert.lengthOf(entries, 2);
        });
    });

});