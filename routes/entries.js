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

module.exports = router;