import util from 'util';
import Entry from './Entry';
import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;

import DBG from 'debug';
const debug = DBG('diary:diary-mongodb');
const error = DBG('diary:error-mongodb');

var client;

async function connectDB() {
    if (!client) {
        client = await MongoClient.connect(process.env.MONGO_URL);
    }
    return {
        db: client.db(process.env.MONGO_DBNAME),
        client: client
    };
}

export async function create(date, title, content) {
    const { db, client } = await connectDB();
    const diaryEntry = new Entry(date, title, content);
    const collection = db.collection('entries');
    console.log(collection);
    await collection.insertOne({ entrydate: date, title: title, content: content});
    return diaryEntry;
}

export async function update(date, title, content) {
    const { db, client } = await connectDB();
    const diaryEntry = new Entry(date, title, content);
    const collection = db.collection('entries');
    await collection.updateOne({ entrydate: date }, { $set: { title, content } });
}

export async function read(date) {
    const { db, client } = await connectDB();
    const collection = db.collection('entries');
    const doc = await collection.findOne({ entrydate: date });
    const diaryEntry = new Entry(doc.entrydate, doc.title, doc.content);
    return diaryEntry;
}

export async function destroy(date) {
    const { db, client } = await connectDB();
    const collection = db.collection('entries');
    await collection.findOneAndDelete({ entrydate: date });
}

export async function datelist() {
    const { db, client } = await connectDB();
    const collection = db.collection('entries');
    const dates = await new Promise((resolve, reject) => {
        var dates = [];
        collection.find({}).forEach(
            entry => { dates.push(entry.entrydate); },
            err => {
                if(err) {
                    reject(err);
                }else {
                    resolve(dates);
                }
            }
        );
    });
    return dates;
}

export async function count() {
    const {db, client } = await connectDB();
    const collection = db.collection('entries');
    const count = await collection.count({});
    return count;
}

export async function close() {
    if(client) {
        client.close();
    }
    client = undefined;
}