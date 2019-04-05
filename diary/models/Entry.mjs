import mongoose from 'mongoose';

var entrySchema = new mongoose.Schema({
    username: {type: String},
    date: {type: Number},
    title: {type: String},
    content: {type: String}
});
// Compount index for unique diary entries
entrySchema.index({username: 1, date: 1}, {unique: true});

var Entry = mongoose.model('Entry', entrySchema);

export default Entry;