import mongoose from 'mongoose';

var entrySchema = new mongoose.Schema({
    userId: {type: Number},
    date: {type: Number},
    title: {type: String},
    content: {type: String}
});

var Entry = mongoose.model('Entry', entrySchema);

export default Entry;