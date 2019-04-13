import util from 'util';
import moment from 'moment';
import express from 'express';
import * as entries from '../models/entries';
import { ensureAuthenticated } from './users';
import Entry from '../models/Entry.mjs';

export const router = express.Router();

const dateFormat = 'Do MMM YY';

// Sidebar history data
async function getDiaryDates(username) {
    let today = new Date().setHours(0, 0, 0, 0).valueOf();
    const diaryEntries = await entries.findAllEntries(username);
    const dates = diaryEntries.reduce((result, entry) => {
        if (entry.date != today) {
            const formattedDate = moment(entry.date).format(dateFormat);
            result.push({
                date: entry.date,
                formattedDate: formattedDate
            });
        }
        return result;
    }, []);
    return dates;
}

// View Diary Entry
router.get('/:entry', ensureAuthenticated, async (req, res, next) => {
    // sidebar data
    const dates = await getDiaryDates(req.user.username);

    // entry data
    var formattedDate;
    var docreate = true;
    var diaryEntry = undefined;
    if (req.params.entry == 'today') {
        var today = new Date().setHours(0, 0, 0, 0).valueOf();
        diaryEntry = await entries.findEntry(req.user.username, today);
        if (diaryEntry) {
            docreate = false;
        }
        formattedDate = moment(today).format(dateFormat);
    } else if (req.params.entry == 'new') {
        var today = new Date().setHours(0, 0, 0, 0).valueOf();
        formattedDate = moment(today).format(dateFormat);
    } else {
        diaryEntry = await entries.findEntry(req.user.username, req.params.entry);
        if (diaryEntry) {
            formattedDate = moment(diaryEntry.date).format(dateFormat);
            docreate = false;
        } else {
            // error
        }
    }

    var message = getMessage(req.query.message);

    res.render('index', {
        title: diaryEntry ? diaryEntry.title : "",
        docreate: docreate,
        date: formattedDate,
        entry: diaryEntry,
        user: req.user,
        entryDates: dates,
        message: message
    });
});

function getMessage(messageCode) {
    switch (messageCode) {
        case '0': return {message: 'Sucessfully removed entry.', class: 'alert-success'};
        case '1': return {message: 'Failed to remove diary entry.', class: 'alert-danger'};
        default: return undefined;
    }
}

// Save Diary Entry
router.post('/save', ensureAuthenticated, async (req, res, next) => {
    var diaryEntry;
    var date = moment(req.body.date, dateFormat).valueOf();
    if (req.body.docreate === 'create') {
        try {
            diaryEntry = await entries.saveEntry(req.user.username, date,
                req.body.title, req.body.content);
        } catch (e) {
            if (e.code == 11000) {
                const dates = await getDiaryDates(req.user.username);
                var entry = new Entry(
                    {
                        username: req.user.username,
                        date: date,
                        title: req.body.title,
                        content: req.body.content
                    });
                res.render('index', {
                    title: req.body.title,
                    docreate: true,
                    date: req.body.date,
                    entry: entry,
                    user: req.user,
                    entryDates: dates,
                    message: {message: 'This date is already recorded', class: 'alert-danger'}
                });
                return;
            }
        }
    } else {
        try {
            diaryEntry = await entries.updateEntry(req.user.username, date,
                req.body.title, req.body.content);
        } catch (e) {
            console.log(e);
        }
    }
    res.redirect('/entry/' + date);
});

// Really destroy note (destroy)
router.get('/destroy/:entry', ensureAuthenticated, async (req, res, next) => {
    try {
        await entries.deleteEntry(req.user.username, req.params.entry);
    } catch (error) {
        res.redirect('/entry/today?message=1');
    }
    res.redirect('/entry/today?message=0');
});