var EntriesModule;

async function model() {
    if (EntriesModule) {
        return EntriesModule;
    }
    EntriesModule = await import(`../models/entries-${process.env.ENTRIES_MODEL}`);
    return EntriesModule;
}

export async function create(date, title, content) {
    return (await model()).create(date, title, content);
}

export async function update(date, title, content) {
    return (await model()).update(date, title, content)
}

export async function read(date) {
    return (await model()).read(date);
}

export async function destroy(date) {
    return (await model()).destroy(date);
}
export async function datelist() {
    return (await model()).datelist();
}

export async function count() {
    return (await model()).count();
}
export async function close() {
    return (await model()).close();
}