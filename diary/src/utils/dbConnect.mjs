import mongoose from 'mongoose';

export function connectDb() {
    const mongoURI = process.env.MONGODB_URI;
    const options = { useNewUrlParser: true };
    mongoose.connect(
        mongoURI,
        options
    )
}