const util = require('util');
const express = require('express');
const router = express.Router();
const entries = require('../models/entries-memory');

// Add new Diary Entry
router.get('/add', (req, res, next) => {
    res.render('entryedit', {
        title: "My day",
        docreate: true,
        entrydate: "",
        entry: undefined
    });
});

// Save Diary Entry
router.post('/save', async (req, res, next) => {
    var diaryEntry;
    if (req.body.docreate === 'create') {
        diaryEntry = await entries.create(req.body.date,
            req.body.title, req.body.content);
    } else {
        diaryEntry = await entries.update(req.body.date,
            req.body.title, req.body.content);
    }
    res.redirect('/entry/view?date=' + req.body.date);
});

// Read Diary Entry
router.get('/view', async (req, res, next) => {
    var diaryEntry = await entries.read(req.query.date);
    res.render('entryview', {
        title: diaryEntry ? diaryEntry.title : "",
        date: req.query.date,
        entry: diaryEntry
    });
});

// Edit Diary Entry
router.get('/edit', async (req, res, next) => {
    var diaryEntry = await entries.read(req.query.date);
    res.render('entryedit', {
        title: diaryEntry ? ("Edit " + diaryEntry.title) : "Add a Note",
        docreate: false,
        date: req.query.date,
        entry: diaryEntry
    });
});

// Ask to delete diary entry
router.get('/destroy', async (req, res, next) => {
    var diaryEntry = await entries.read(req.query.date);
    res.render('entrydestroy', {
        title: diaryEntry ? diaryEntry.title : "",
        date: req.query.date,
        entry: diaryEntry
    });
});

// Really destroy note (destroy)
router.post('/destroy/confirm', async (req, res, next) => {
    await entries.destroy(req.body.date);
    res.redirect('/');
});
module.exports = router;