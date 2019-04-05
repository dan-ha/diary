import Entry from "./Entry.mjs";
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Diary');


export async function saveEntry(date, title, content) {
    const diaryEntry = new Entry({
        date,
        title,
        content
    });
    await diaryEntry.save();
}

export async function findAllEntries() {
    return await Entry.find({});
}

// returns null in case it doesn't find an entry
export async function findEntry(date) {
    return await Entry.findOne({ date });
}

export async function updateEntry(date, title, content) {
    var result = await Entry.updateOne({ date }, { title, content });
    if (result.n) {
        return true;
    } else {
        return false;
    }
}

export async function deleteEntry(date) {
    var result = await Entry.deleteOne({ date });
    if (result.deletedCount) {
        return true;
    } else {
        return false;
    }
}