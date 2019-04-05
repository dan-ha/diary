import mongoose from 'mongoose';

var entrySchema = new mongoose.Schema({
    date: {type: Number, index: {unique: true}},
    title: {type: String},
    content: {type: String}
});

var Entry = mongoose.model('Entry', entrySchema);

export default Entry;