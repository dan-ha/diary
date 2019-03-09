import util from 'util';
import express from 'express';
import * as entries from '../models/entries';
import { ensureAuthenticated } from './users';

export const router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, async (req, res, next) => {
  let datelist = await entries.datelist();
  let entryPromises = datelist.map(date => {
    return entries.read(date);
  })
  let diaryEntries = await Promise.all(entryPromises);
  res.render('index', { 
    title: 'Online Diary',
    user: req.user ? req.user : undefined,
    diaryEntries: diaryEntries });
});