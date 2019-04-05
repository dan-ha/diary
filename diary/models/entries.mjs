import Entry from "./Entry.mjs";
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Diary');


export async function saveEntry(userId, date, title, content) {
    const diaryEntry = new Entry({
        userId,
        date,
        title,
        content
    });
    await diaryEntry.save();
}

export async function findAllEntries(userId) {
    return await Entry.find({userId});
}

// returns null in case it doesn't find an entry
export async function findEntry(userId, date) {
    return await Entry.findOne({ userId, date });
}

export async function updateEntry(userId, date, title, content) {
    var result = await Entry.updateOne({userId, date }, { title, content });
    if (result.n) {
        return true;
    } else {
        return false;
    }
}

export async function deleteEntry(userId, date) {
    var result = await Entry.deleteOne({ date });
    if (result.deletedCount) {
        return true;
    } else {
        return false;
    }
}