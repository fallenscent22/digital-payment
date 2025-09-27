require('dotenv').config();
const QRCode = require('qrcode');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: String,
    phoneNumber: { type: String, unique: true, required: true },
    balance: { type: Number, default: 1000 }, // Set initial balance to 1000
    userId: { type: String, unique: true, default: uuidv4 },
    upiId: { type: String, unique: true, default: function () { return `${this.phoneNumber}@softpay`; } },
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
    const { name, email, password, phoneNumber } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, phoneNumber });
        await user.save();
        const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).send({ user, token });
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
            return res.status(400).send('Invalid email');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error('Login failed: Invalid password');
            return res.status(400).send('Invalid password');
        }
        const token = jwt.sign({ userId: user.userId }, JWT_SECRET);
        res.send({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error');
    }
});

app.get('/api/user', async (req, res) => {
    const token = req.query.token;
    if (!token) return res.status(401).send('Token is required');
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ userId: decoded.userId });
        let recurringPayments = await RecurringPayment.find({ userId: decoded.userId });

        // Populate receiver info for each recurring payment
        recurringPayments = await Promise.all(recurringPayments.map(async (rp) => {
            const receiver = await User.findOne({ userId: rp.receiverId });
            return {
                ...rp.toObject(),
                receiverName: receiver ? receiver.name : 'Unknown',
                receiverPhoneNumber: receiver ? receiver.phoneNumber : '',
            };
        }));

        res.send({ user, recurringPayments });
    } catch (error) {
        res.status(401).send('Invalid token');
    }
});

app.post('/api/send-money', async (req, res) => {
    const { receiverPhoneNumber, receiverUpiId, amount, token } = req.body;
    if (!token) {
        return res.status(401).send('Token is required');
    }
    if ((!receiverPhoneNumber && !receiverUpiId) || !amount || isNaN(amount) || amount <= 0) {
        return res.status(400).send('Invalid receiver details or amount');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const sender = await User.findOne({ userId: decoded.userId });
        if (sender.balance < amount) {
            return res.status(400).send('Insufficient balance');
        }
        // const receiver = await User.findOne({ phoneNumber: receiverPhoneNumber, upiId: receiverUpiId });
        const receiver = await User.findOne({
            $or: [{ phoneNumber: receiverPhoneNumber }, { upiId: receiverUpiId }]
        });


        if (!receiver) {
            return res.status(400).send('Receiver not found');
        }
        if (sender.userId === receiver.userId) {
            return res.status(400).send('You cannot transfer money to yourself');
        }
        // Atomic transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update balances
            sender.balance -= amount;
            receiver.balance += amount;

            await sender.save({ session });
            await receiver.save({ session });

            // Create transaction record
            await new Transaction({
                senderId: sender.userId,
                receiverId: receiver.userId,
                amount,
                date: new Date()
            }).save({ session });

            await session.commitTransaction();
            res.send('Transaction successful');
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).send(error.message || 'Transaction failed');
    }
});

app.get('/api/transactions', async (req, res) => {
    const token = req.query.token;
    if (!token) return res.status(401).send('Token is required');
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const transactions = await Transaction.find({
            $or: [{ senderId: decoded.userId }, { receiverId: decoded.userId }]
        });

        // Populate receiver info for each transaction
        const transactionsWithReceiver = await Promise.all(transactions.map(async (tx) => {
            const receiver = await User.findOne({ userId: tx.receiverId });
            return {
                ...tx.toObject(),
                receiverName: receiver ? receiver.name : 'Unknown',
                receiverPhoneNumber: receiver ? receiver.phoneNumber : '',

            };
        }));

        res.send(transactionsWithReceiver);
        console.log("Decoded userId:", decoded.userId);                      // newwwwwwwwwwwwwwwwwww
        console.log("Transactions found:", transactions);                   // newwwwwwwwwwwwwwwwwwww
    } catch (error) {
        res.status(401).send('Invalid token');
    }
});

app.post('/api/recurring-payment', async (req, res) => {
    const { receiverPhoneNumber, amount, frequency, token } = req.body;
    if (!token) {
        return res.status(401).send('Token is required');
    }
    if (!receiverPhoneNumber) {
        return res.status(400).send('Receiver phone number is required');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;
        // Fetch the receiver details using the phone number
        const receiver = await User.findOne({ phoneNumber: receiverPhoneNumber });
        if (!receiver) {
            return res.status(404).send('Receiver not found');
        }

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
        const recurringPayment = new RecurringPayment({ userId, receiverId: receiver.userId, amount, frequency, nextPaymentDate });
        await recurringPayment.save();
        res.send('Recurring payment scheduled');
    } catch (error) {
        console.error('Error scheduling recurring payment:', error);
        res.status(500).send('Server error');
    }
});

// Endpoint to get receiver details by UPI ID
app.get('/api/get-receiver', async (req, res) => {
    const token = req.query.token;
    const { phoneNumber, upiId } = req.query; // Extract upiId from query params
    if (!token) {
        return res.status(401).send('Token is required');
    }
    if (!phoneNumber && !upiId) {
        return res.status(400).send('Phone number is required');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // const receiver = await User.findOne({ phoneNumber : phoneNumber}); 
        let query = {};
        if (phoneNumber) query.phoneNumber = phoneNumber;
        if (upiId) query.upiId = upiId;
        const receiver = await User.findOne(query);

        if (!receiver) {
            return res.status(404).send('Receiver not found with Phone number: ' + phoneNumber); // More descriptive error message
        }

        //res.status(200).json({ name: receiver.name , upiId: receiver.upiId}); // Send the receiver's name and upi id in the response
        res.status(200).json({ name: receiver.name, upiId: receiver.upiId, phoneNumber: receiver.phoneNumber });
    } catch (error) {
        console.error('Error fetching receiver user:', error);
        res.status(401).send('server error');
    }
});

app.post('/api/payment/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
    console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);
    console.log("Amount:", amount);

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(parseFloat(amount) * 100), // stripe expects smallest currency unit
            currency: 'INR',
        });

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/savings-goal', async (req, res) => {
    const { goalName, targetAmount, token } = req.body;
    if (!token) {
        return res.status(401).send('Token is required');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ userId: decoded.userId });
        user.savingsGoals.push({ goalName, targetAmount });
        await user.save();
        res.send('Savings goal added');
    } catch (error) {
        console.error('Error adding savings goal:', error);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});