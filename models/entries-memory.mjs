import Entry from './Entry';

var diaryEntries = [];

let newEntry = new Entry(new Date(), 'title', 'content');
diaryEntries[newEntry.date] = newEntry;

export async function create(date, title, content) {
    diaryEntries[date] = new Entry(date, title, content);
    return diaryEntries[date];
}

export async function update(date, title, content) {
    diaryEntries[date] = new Entry(date, title, content);
    return diaryEntries[date];
}

export async function read(date) {
    if (diaryEntries[date]) {
        return diaryEntries[date];
    } else {
        throw new Error(`Diary entry for date ${date} does not exist`);
    }
}
export async function destroy(date) {
    if (diaryEntries[date]) {
        delete diaryEntries[date];
    } else {
        throw new Error(`Diary entry for date ${date} does not exist`);
    }
}

export async function datelist (){
    return Object.keys(diaryEntries);
}
export async function count() {
    return diaryEntries.length;
}