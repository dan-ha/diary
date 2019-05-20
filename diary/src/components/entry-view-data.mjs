import moment from 'moment';
import { findEntry } from '../models/entrieDao';

const dateFormat = 'Do MMM YY';

export async function getSelectedEntryData(username, entryId) {

    const docreate = doCreate(entryId);
    const entry = await getEntry(username, entryId);
    const date = getDate(entry);
    const formattedDate = getFormattedDate(entry);
    return {
        docreate,
        entry,
        date,
        formattedDate
    }
}

export function convertMessageCode(messageCode) {
    switch (messageCode) {
        case '0': return { message: 'Sucessfully removed entry.', class: 'alert-success' };
        case '1': return { message: 'Failed to remove diary entry.', class: 'alert-danger' };
        case '2': return { message: 'Failed to save/update new diery entry.', class: 'alert-danger' };
        case '3': return { message: 'Sucessfully created new entry.', class: 'alert-success' };
        case '1100': return { message: 'This date is already recorded', class: 'alert-danger' };
        default: return undefined;
    }
}

function doCreate(entryId) {
    const date = new Date().setHours(0, 0, 0, 0).valueOf();
    return entryId == 'new' || entryId == date;
}

async function getEntry(username, entryId) {
    if (isNaN(entryId)) {
        return undefined;
    } else {
        return await findEntry(username, entryId);
    }
}

function getDate(entry) {
    if (entry) {
        return entry.date;
    } else {
        return new Date().setHours(0, 0, 0, 0).valueOf();
    }
}

function getFormattedDate(entry) {
    if (entry) {
        return moment(entry.date).format(dateFormat);
    } else {
        const today = new Date().setHours(0, 0, 0, 0).valueOf();
        return moment(today).format(dateFormat);
    }
}