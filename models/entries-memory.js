const Entry = require('./Entry');

var diaryEntries = [];

exports.update = exports.create = async function (date, title, content) {
    diaryEntries[date] = new Entry(date, title, content);
    return diaryEntries[date];
}
exports.read = async function (date) {
    if (diaryEntries[date]) {
        return diaryEntries[date];
    } else {
        throw new Error(`Diary entry for date ${date} does not exist`);
    }
}
exports.destroy = async function (date) {
    if (diaryEntries[date]) {
        delete diaryEntries[date];
    } else {
        throw new Error(`Diary entry for date ${date} does not exist`);
    }
}

exports.keylist = async function () {
    return Object.keys(diaryEntries);
}
exports.count = async function () {
    return diaryEntries.length;
}