import util from 'util';
import express from 'express';
import * as entries from '../models/entries';

export const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  let datelist = await entries.datelist();
  let entryPromises = datelist.map(date => {
    return entries.read(date);
  })
  let diaryEntries = await Promise.all(entryPromises);
  res.render('index', { title: 'Online Diary', diaryEntries: diaryEntries });
});