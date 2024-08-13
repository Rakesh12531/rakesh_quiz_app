import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true },
    totalTimeSpent: { type: Number, required: true }
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
