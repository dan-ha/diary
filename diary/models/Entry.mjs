import mongoose from 'mongoose';

var entrySchema = new mongoose.Schema({
    username: {type: String, required: true},
    date: {type: Number, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true}
});
// Compount index for unique diary entries
entrySchema.index({username: 1, date: 1}, {unique: true});

var Entry = mongoose.model('Entry', entrySchema);

export default Entry;