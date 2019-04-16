import moment from 'moment';
import express from 'express';
import { getHistorySidebarData } from '../components/history-sidebar';
import { getSelectedEntryData, convertMessageCode } from '../components/entry-view-data';
import { saveNewEntry } from '../components/entry-post-data';
import { ensureAuthenticated } from './users';
import { deleteEntry} from '../models/entries';

export const router = express.Router();
const dateFormat = 'Do MMM YY';

router.get('/', ensureAuthenticated, async (req, res, next) => {
    const today = new Date().setHours(0, 0, 0, 0).valueOf();
    res.redirect(`/${today}`);
});

// View selected Diary Entry
router.get('/:entryId', ensureAuthenticated, async (req, res, next) => {
    // history sidebar data
    const historyData = await getHistorySidebarData(req.user.username, req.params.entryId);

    // selected entry data
    const selectedEntryData = await getSelectedEntryData(req.user.username, req.params.entryId);

    // get message based on message code
    const message = convertMessageCode(req.query.message);

    res.render('index', {
        historyData,
        entryData: selectedEntryData,
        message,
        user: req.user
    });
});

// Save Diary Entry
router.post('/save', ensureAuthenticated, async (req, res, next) => {
    try {
        await saveNewEntry(req.user.username, req.body);
        const date = moment(req.body.formattedDate, dateFormat).valueOf();
        res.redirect(`/${date}?message=3`);
    } catch (err) {
        // Mongodb E1100 - duplicate key error
        let errorCode;
        if (err.code == 1100) {
            errorCode = '1100';
        } else {
            errorCode = '2';
        }
        // history sidebar data
        const historyData = await getHistorySidebarData(req.user.username, req.body.date);

        // faied entry data
        const entryData = {
            docreate: req.body.docreate,
            entry: {
                date: req.body.date,
                title: req.body.title,
                content: req.body.content
            },
            date: req.body.date,
            formattedDate: req.body.formattedDate
        }

        const message = convertMessageCode(errorCode);

        res.render('index', {
            historyData,
            entryData,
            message,
            user: req.user
        });
    }
});

// Really destroy note
router.get('/destroy/:entry', ensureAuthenticated, async (req, res, next) => {
    const today = new Date().setHours(0, 0, 0, 0).valueOf();
    try {
        await deleteEntry(req.user.username, req.params.entry);
    } catch (error) {
        console.log(error);
        res.redirect(`/${today}?message=1`);
    }
    res.redirect(`/${today}?message=0`);
});