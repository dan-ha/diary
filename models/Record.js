const _record_date = Symbol('date');
const _record_title = Symbol('title');
const _record_content = Symbol('content');

module.exports = class Record {
    constructor(date, title, content) {
        this[_record_date] = date;
        this[_record_title] = title;
        this[_record_content] = content;
    }

    get date() { return this[_record_date]; }
    get title() { return this[_record_title]; }
    set title(newTitle) { this[_record_title] = newTitle; }
    get content() { return this[_record_content]; }
    set content(newContent) { this[_record_content] = newContent; }
}