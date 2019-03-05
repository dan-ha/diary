const _entry_date = Symbol('date');
const _entry_title = Symbol('title');
const _entry_content = Symbol('content');

module.exports = class Entry {
    constructor(date, title, content) {
        this[_entry_date] = date;
        this[_entry_title] = title;
        this[_entry_content] = content;
    }

    get date() { return this[_entry_date]; }
    get title() { return this[_entry_title]; }
    set title(newTitle) { this[_enrty_title] = newTitle; }
    get content() { return this[_entry_content]; }
    set content(newContent) { this[_entry_content] = newContent; }
}