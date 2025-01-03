const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true }
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    transactions: [transactionSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;