# Digital Payment - SoftPay 💳

A modern **full-stack digital wallet** application that simulates real-world payment platforms like PhonePe, Google Pay, or Paytm. Users can register, send money instantly, pay with cards via Stripe, set up recurring payments, create savings goals, and scan/generate QR codes.

Built as a portfolio project to demonstrate end-to-end payment system development with secure authentication, atomic transactions, and third-party payment gateway integration.

## 🌟 Features

- **User Authentication**: Secure signup/login with JWT and bcrypt password hashing
- **Digital Wallet**: View balance, generate personal UPI ID (`phone@softpay`)
- **Instant Money Transfer**: Send money using phone number or QR code scan
- **Card Payments**: Secure card processing using **Stripe Payment Intents**
- **Recurring Payments**: Schedule daily, weekly, or monthly automatic payments
- **Smart Savings**: Create and track savings goals
- **Transaction History**: Full history with receiver details and timestamps
- **QR Code Support**: Generate your QR code + scan others for quick payments
- **Responsive UI**: Clean, modern design with Material-UI

## 🛠 Tech Stack

### Frontend
- React.js (Create React App)
- Material-UI (MUI) for components
- React Router v6 for navigation
- Stripe.js + `@stripe/react-stripe-js` for card payments
- QR code generation (`qrcode.react`) and scanning (`react-qr-scanner`)
- Axios for API calls

### Backend
- Node.js + Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Stripe Node SDK for Payment Intents
- MongoDB atomic transactions for safe money transfers

### Deployment
- **Frontend**: Vercel[](https://digital-payment-six.vercel.app)
- **Backend**: Any Node.js hosting (Render, Railway, etc.)

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud Atlas)
- Stripe account (for publishable & secret keys)

### 1. Clone the Repository
```bash
git clone https://github.com/fallenscent22/digital-payment.git
cd digital-payment
```
2. Backend Setup
```
# Install dependencies (if package.json exists in root or server folder)
npm install

# Create .env file in the backend root
touch .env

Add the following to .env:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
STRIPE_SECRET_KEY=sk_test_...
PORT=5000
```
Run the backend:
```
node index.js
# or
npm start
```
3. Frontend Setup
```
cd client
npm install

Create .env in the client folder:
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
Run the frontend:
```
npm start
```
Open http://localhost:3000 — default redirect to login.
Default Test Credentials

After signup, you get ₹1,000 initial balance.
📖 How It Works
Payment Flow (Stripe + Wallet)

    User enters receiver phone → auto-fetches name (debounced)
    Enters amount + card details via Stripe CardElement
    Frontend creates PaymentIntent on backend
    stripe.confirmCardPayment() processes the card (supports 3D Secure)
    On success → backend performs atomic MongoDB transaction:
        Deduct amount from sender
        Add amount to receiver
        Log transaction
    Updated balance and history shown instantly

QR Code Flow

    Home page shows your personal QR code
    Transaction page allows scanning QR to auto-fill receiver details

📂 Project Structure

digital-payment/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Login, Signup, Navbar, etc.
│   │   ├── pages/           # Home, TransactionPage, RecurringPayment, etc.
│   │   ├── api.js
│   │   └── App.js
│   └── public/
├── server/ or index.js      # Node.js + Express Backend
├── .env
└── README.md

🔑 Key API Endpoints
Method	Endpoint	Description
POST	/api/register	User registration
POST	/api/login	User login (returns JWT)
GET	/api/user	Get profile + balance + recurring payments
GET	/api/transactions	Fetch transaction history
POST	/api/send-money	Execute wallet transfer
POST	/api/payment/create-payment-intent	Create Stripe PaymentIntent
POST	/api/recurring-payment	Schedule recurring payment
POST	/api/savings-goal	Add savings goal
GET	/api/get-receiver	Lookup receiver by phone/UPI
🛡️ Security Features

    Passwords hashed with bcrypt
    JWT-based authentication
    MongoDB atomic transactions (prevents double-spending)
    Card data never touches the server (Stripe handles PCI compliance)
    CORS configured for production frontend
