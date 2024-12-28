const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/digital-payment', {
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
    email: String,
    password: String,
    phoneNumber: String,
});

const paymentSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    cardNumber: String,
    expiryDate: String,
    cvv: String,
    amount: Number,
    transactionId: String,
    date: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Payment = mongoose.model('Payment', paymentSchema);

// Routes
app.post('/api/register', async (req, res) => {
    const { email, password, phoneNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, phoneNumber });
    await user.save();
    res.status(201).send(user);
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send('Invalid password');
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.send({ token });
});

app.post('/api/payments', async (req, res) => {
    const { token, cardNumber, expiryDate, cvv, amount } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const transactionId = new mongoose.Types.ObjectId().toString();
    const payment = new Payment({ userId: decoded.userId, cardNumber, expiryDate, cvv, amount, transactionId });
    await payment.save();
    res.status(201).send(payment);
});

app.get('/api/payments', async (req, res) => {
    const { token } = req.query;
    const decoded = jwt.verify(token, JWT_SECRET);
    const payments = await Payment.find({ userId: decoded.userId });
    res.status(200).send(payments);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});