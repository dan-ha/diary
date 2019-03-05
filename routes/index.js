const express = require('express');
const router = express.Router();
const entries = require('../models/entries-memory');

/* GET home page. */
router.get('/', async (req, res, next) => {
  let datelist = await entries.datelist();
  let entryPromises = datelist.map( date => {
    return entries.read(date);
  })
  let diaryEntries = await Promise.all(entryPromises);
  res.render('index', { title: 'Online Diary', diaryEntries: diaryEntries });
});

module.exports = router;
