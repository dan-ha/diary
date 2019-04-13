import util from 'util';
import moment from 'moment';
import express from 'express';
import * as entries from '../models/entries';
import { ensureAuthenticated } from './users';
import Entry from '../models/Entry.mjs';

export const router = express.Router();

// View Diary Entry
router.get('/:entry', ensureAuthenticated, async (req, res, next) => {
    // sidebar data
    let todayy = new Date().setHours(0,0,0,0).valueOf();
    let diaryEntries = await entries.findAllEntries(req.user.username);
    const dates = diaryEntries.reduce((result, entry) => {
        if(entry.date != todayy) {
            const formattedDate = moment(entry.date).format("Do MMM YY");
            result.push({
                date: entry.date,
                formattedDate: formattedDate
            }); 
        }
        return result;
    }, []);

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
        formattedDate = moment(today).format('Do MMM YY');
    } else if (req.params.entry == 'new') {
        var today = new Date().setHours(0, 0, 0, 0).valueOf();
        formattedDate = moment(today).format('Do MMM YY');
    } else {
        diaryEntry = await entries.findEntry(req.user.username, req.params.entry);
        if (diaryEntry) {
            formattedDate = moment(diaryEntry.date).format('Do MMM YY');
            docreate = false;
        } else {
            // error
        }
    }

    res.render('index', {
        title: diaryEntry ? diaryEntry.title : "",
        docreate: docreate,
        date: formattedDate,
        entry: diaryEntry,
        user: req.user,
        entryDates: dates,
    });
})

// Save Diary Entry
router.post('/save', ensureAuthenticated, async (req, res, next) => {
    var diaryEntry;
    var date = moment(req.body.date, "Do MMM YY").valueOf();
    if (req.body.docreate === 'create') {
        try {
            diaryEntry = await entries.saveEntry(req.user.username, date,
                req.body.title, req.body.content);
        } catch (e) {
            if (e.code == 11000) {

                let diaryEntries = await entries.findAllEntries(req.user.username);
                const dates = diaryEntries.map((entry) => {
                    const formattedDate = moment(entry.date).format("Do MMM YY");
                    return {
                        date: entry.date,
                        formattedDate: formattedDate
                    };
                });
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
                    error: 'This date is already recorded'
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

// // Ask to delete diary entry
// router.get('/destroy', ensureAuthenticated, async (req, res, next) => {
//     var diaryEntry = await entries.findEntry(req.query.date);
//     res.render('entrydestroy', {
//         title: diaryEntry ? diaryEntry.title : "",
//         date: req.query.date,
//         entry: diaryEntry,
//         user: req.user
//     });
// });

// Really destroy note (destroy)
router.post('/destroy/confirm', ensureAuthenticated, async (req, res, next) => {
    await entries.deleteEntry(req.body.date);
    res.redirect('/');
});