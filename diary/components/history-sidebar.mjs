import moment from 'moment';
import { findAllEntries } from '../models/entries';

const dateFormat = 'Do MMM YY';

export async function getHistorySidebarData(username, entryId) {
    let dates = await getEntriesDates(username);

    addTodaysEntry(dates);
    addNewEntryOption(dates);

    highlightSelectedEntry(dates, entryId);

    return dates;
}

// array of old diary entries dates
async function getEntriesDates(username) {
    let diaryEntries = await findAllEntries(username);
    const datesData = diaryEntries.map((entry) => {
        const formattedDate = moment(entry.date).format(dateFormat);
        return {
            date: entry.date,
            formattedDate: formattedDate
        };
    });
    return datesData;
}

function addTodaysEntry(entriesDates) {
    let today = new Date().setHours(0, 0, 0, 0).valueOf();
    if (!entriesDates.some(d => d.date == today)) {
        entriesDates.unshift({
            date: today,
            formattedDate: 'Today'
        });
    } else {
        entriesDates.map(entry => {
            if (entry.date == today) {
                entry.formattedDate = 'Today';
            }
        });
    }
}

function addNewEntryOption(entriesDates) {
    entriesDates.push({
        date: 'new',
        formattedDate: '+New Entry'
    });
}

function highlightSelectedEntry(entriesDates, entryId) {
    entriesDates.forEach(date => {
        if (date.date == entryId) {
            date.class = 'highlight';
        }
    });
}