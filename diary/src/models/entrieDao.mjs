import Entry from "./Entry.mjs";

export async function saveEntry(username, date, title, content) {
    const diaryEntry = new Entry({
        username,
        date,
        title,
        content
    });
    await diaryEntry.save();
}

export async function findAllEntries(username) {
    return await Entry.find({ username }, {}, {sort:{date: -1}});
}

export async function findAllEntriesDates(username) {
    return await Entry.find({username}, ['date'], {sort:{date: -1}});
}

// returns null in case it doesn't find an entry
export async function findEntry(username, date) {
    return await Entry.findOne({ username, date });
}

export async function updateEntry(username, date, title, content) {
    var result = await Entry.updateOne({ username, date }, { title, content });
    if (result.n) {
        return true;
    } else {
        return false;
    }
}

export async function deleteEntry(username, date) {
    var result = await Entry.deleteOne({ username, date });
    if (result.deletedCount) {
        return true;
    } else {
        return false;
    }
}