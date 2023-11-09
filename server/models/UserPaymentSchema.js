const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
     razorpay_order_id: String,
     razorpay_payment_id: String,
     razorpay_signature: String,
     // amount: Number,
     // userId: String,
     timestamp: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
