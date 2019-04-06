import util from 'util';
import moment from 'moment';
import express from 'express';
import * as entries from '../models/entries';
import { ensureAuthenticated } from './users';

export const router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, async (req, res, next) => {
  let diaryEntries = await entries.findAllEntries(req.user.username);
  const dates = diaryEntries.map((entry) => {
    return moment(entry.date).format("Do MMM YY");
  });
  console.log(dates);
  res.render('index', { 
    title: 'Online Diary',
    user: req.user ? req.user : undefined,
    entryDates: dates });
});