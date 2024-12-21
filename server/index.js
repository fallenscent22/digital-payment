const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/digital_payment', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const paymentSchema = new mongoose.Schema({
    cardNumber: String,
    expiryDate: String,
    cvv: String,
    amount: Number,
});

const Payment = mongoose.model('Payment', paymentSchema);

// Routes
app.post('/api/payments', async (req, res) => {
    const { cardNumber, expiryDate, cvv, amount } = req.body;
    const payment = new Payment({ cardNumber, expiryDate, cvv, amount });
    await payment.save();
    res.status(201).send(payment);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});