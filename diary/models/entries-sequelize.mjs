import fs from 'fs-extra';
import util from 'util';
import jsyaml from 'js-yaml';
import Entry from './Entry';
import Sequelize from 'sequelize';
import DBG from 'debug';
const debug = DBG('diary:diary-sequelize');
const error = DBG('diary:error-sequelize');

var SQEntry;
var sequlz;

async function connectDB() {
    if (typeof sequlz === 'undefined') {
        const YAML = await fs.readFile(process.env.SEQUELIZE_CONNECT, 'utf8');
        const params = jsyaml.safeLoad(YAML, 'utf8');
        sequlz = new Sequelize(params.dbname, params.username,
            params.password, params.params);
    }
    if (SQEntry) return SQEntry.sync();
    SQEntry = sequlz.define('Entry', {
        date: { type: Sequelize.STRING, primaryKey: true, unique: true },
        title: Sequelize.STRING,
        content: Sequelize.TEXT
    });
    return SQEntry.sync();
}

export async function create(date, title, content) {
    const SQEntry = await connectDB();
    const entry = new Entry(date, title, content);
    await SQEntry.create({ date: date, title: title, content: content });
    return entry;
}

export async function update(date, title, content) {
    const SQEntry = await connectDB();
    const entry = await SQEntry.findOne({ where: { date: date } });
    if (!entry) {
        throw new Error(`No diary entry found for date: ${date}`);
    } else {
        await entry.update({ title: title, content: content });
        return new Entry(date, title, content);
    }
}

export async function read(date) {
    const SQEntry = await connectDB();
    const entry = await SQEntry.findOne({ where: { date: date } });
    if (!entry) {
        throw new Error(`No diary entry found for date: ${date}`);
    } else {
        return new Entry(entry.date, entry.title, entry.content);
    }
}

export async function destroy(date) {
    const SQEntry = await connectDB();
    const entry = await SQEntry.findOne({ where: { date: date } });
    return entry.destroy();
}

export async function datelist() {
    const SQEntry = await connectDB();
    const entries = await SQEntry.findAll({attributes: ['date']});
    return entries.map(entry=>entry.date);
}

export async function count() {
    const SQEntry = await connectDB();
    const count = await SQEntry.count();
    return count;
}
export async function close() {
    if(sequlz) sequlz.close();
    sequlz = undefined;
    SQEntry = undefined;
}