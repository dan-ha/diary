import util from 'util';
import express from 'express';
import * as entries from '../models/entries';
import { ensureAuthenticated } from './users';

export const router = express.Router();

// Add new Diary Entry
router.get('/add', ensureAuthenticated, (req, res, next) => {
    res.render('entryedit', {
        title: "My day",
        docreate: true,
        date: "",
        user: req.user,
        entry: undefined
    });
});

// Save Diary Entry
router.post('/save', ensureAuthenticated,async (req, res, next) => {
    var diaryEntry;
    if (req.body.docreate === 'create') {
        diaryEntry = await entries.saveEntry(req.user.username, req.body.date,
            req.body.title, req.body.content);
    } else {
        diaryEntry = await entries.update(req.user.username, req.body.date,
            req.body.title, req.body.content);
    }
    res.redirect('/entry/view?date=' + req.body.date);
});

// Read Diary Entry
router.get('/view', ensureAuthenticated, async (req, res, next) => {
    var diaryEntry = await entries.findEntry(req.query.date);
    res.render('entryview', {
        title: diaryEntry ? diaryEntry.title : "",
        date: req.query.date,
        entry: diaryEntry,
        user: req.user
    });
});

// Edit Diary Entry
router.get('/edit', ensureAuthenticated, async (req, res, next) => {
    var diaryEntry = await entries.findEntry(req.query.date);
    res.render('entryedit', {
        title: diaryEntry ? ("Edit " + diaryEntry.title) : "Add a Note",
        docreate: false,
        date: req.query.date,
        entry: diaryEntry,
        user: req.user,
    });
});

// Ask to delete diary entry
router.get('/destroy', ensureAuthenticated, async (req, res, next) => {
    var diaryEntry = await entries.findEntry(req.query.date);
    res.render('entrydestroy', {
        title: diaryEntry ? diaryEntry.title : "",
        date: req.query.date,
        entry: diaryEntry,
        user: req.user
    });
});

// Really destroy note (destroy)
router.post('/destroy/confirm', ensureAuthenticated, async (req, res, next) => {
    await entries.deleteEntry(req.body.date);
    res.redirect('/');
});