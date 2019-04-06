import util from 'util';
import moment from 'moment';
import express from 'express';
import * as entries from '../models/entries';
import { ensureAuthenticated } from './users';

export const router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, async (req, res, next) => {
  const today = new Date().setHours(0,0,0,0);
  let diaryEntries = await entries.findAllEntries(req.user.username);
  const dates = diaryEntries.map((entry) => {
    const formattedDate = moment(entry.date).format("Do MMM YY"); 
    return {
      date: entry.date, 
      formattedDate: formattedDate
    };
  });
  res.render('index', { 
    title: 'Online Diary',
    user: req.user ? req.user : undefined,
    today: today,
    entryDates: dates });
});