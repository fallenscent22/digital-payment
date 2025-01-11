const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://nikhithachatla6:nikhitha@digitalwallet.hbil4.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error(err);
});

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    phoneNumber: String,
    balance: { type: Number, default: 100000 }, // Set initial balance to 100,000
    userId: { type: String, unique: true, default: uuidv4 },
    upiId: { type: String, unique: true, default: () => `upi-${uuidv4()}` },
    savingsGoals: [{ goalName: String, targetAmount: Number, currentAmount: { type: Number, default: 0 } }],
});

const transactionSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    amount: Number,
    date: { type: Date, default: Date.now },
});

const recurringPaymentSchema = new mongoose.Schema({
    userId: String,
    receiverId: String,
    amount: Number,
    frequency: String, // e.g., 'daily', 'weekly', 'monthly'
    nextPaymentDate: Date,
});

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const RecurringPayment = mongoose.model('RecurringPayment', recurringPaymentSchema);

// Routes
app.post('/api/register', async (req, res) => {
    const { email, password, phoneNumber } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, phoneNumber });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Server error');
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.error('Login failed: Invalid email');
            return res.status(400).send('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error('Login failed: Invalid password');
            return res.status(400).send('Invalid email or password');
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.send({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error');
    }
});

app.get('/api/user', async (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(401).send('Token is required');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        const recurringPayments = await RecurringPayment.find({ userId: decoded.userId });
        res.send({ user, recurringPayments });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(401).send('Invalid token');
    }
});

app.post('/api/send-money', async (req, res) => {
    const { receiverUpiId, amount, token } = req.body;
    if (!token) {
        return res.status(401).send('Token is required');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const sender = await User.findById(decoded.userId);
        if (sender.balance < amount) {
            return res.status(400).send('Insufficient balance');
        }
        const receiver = await User.findOne({ upiId: receiverUpiId });
        if (!receiver) {
            return res.status(400).send('Receiver not found');
        }
        sender.balance -= amount;
        receiver.balance += amount;
        await sender.save();
        await receiver.save();

        const transaction = new Transaction({
            senderId: sender.userId,
            receiverId: receiver.userId,
            amount,
        });
        await transaction.save();

        res.send('Transaction successful');
    } catch (error) {
        console.error('Error during transaction:', error);
        res.status(401).send('Invalid token');
    }
});

app.get('/api/transactions', async (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(401).send('Token is required');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const transactions = await Transaction.find({ senderId: decoded.userId });
        res.send(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(401).send('Invalid token');
    }
});

app.post('/api/recurring-payment', async (req, res) => {
    const { receiverId, amount, frequency, token } = req.body;
    if (!token) {
        return res.status(401).send('Token is required');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;
        const nextPaymentDate = new Date();
        switch (frequency) {
            case 'daily':
                nextPaymentDate.setDate(nextPaymentDate.getDate() + 1);
                break;
            case 'weekly':
                nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
                break;
            case 'monthly':
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
                break;
            default:
                return res.status(400).send('Invalid frequency');
        }
        const recurringPayment = new RecurringPayment({ userId, receiverId, amount, frequency, nextPaymentDate });
        await recurringPayment.save();
        res.send('Recurring payment scheduled');
    } catch (error) {
        console.error('Error scheduling recurring payment:', error);
        res.status(500).send('Server error');
    }
});

app.post('/api/savings-goal', async (req, res) => {
    const { goalName, targetAmount, token } = req.body;
    if (!token) {
        return res.status(401).send('Token is required');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        user.savingsGoals.push({ goalName, targetAmount });
        await user.save();
        res.send('Savings goal added');
    } catch (error) {
        console.error('Error adding savings goal:', error);
        res.status(500).send('Server error');
    }
});
//changes made in next 5 lines of the code below
/*
const userDetails = await UserModel.findById(userId); // Replace with your actual database query
console.log(userDetails); // Ensure data is correct before sending the response
res.status(200).json(userDetails);
console.log("Middleware passed!");
console.log("Request received:", req.body); // Backend
console.log("API response:", response.data); // Frontend
*/

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});