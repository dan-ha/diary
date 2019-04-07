import util from 'util';
import moment from 'moment';
import express from 'express';
import * as entries from '../models/entries';
import { ensureAuthenticated } from './users';

export const router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, async (req, res, next) => {
  res.redirect('/entry/today');
});