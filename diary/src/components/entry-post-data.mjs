import moment from 'moment';
import { saveEntry, updateEntry } from '../models/entrieDao';

const dateFormat = 'Do MMM YY';

export async function saveNewEntry(username, bodyData) {
    if (bodyData.docreate == 'create') {
        const date = moment(bodyData.formattedDate, dateFormat).valueOf();
        await saveEntry(username, date, bodyData.title, bodyData.content);
    } else {
        await updateEntry(username, bodyData.date, bodyData.title, bodyData.content);
    }
}