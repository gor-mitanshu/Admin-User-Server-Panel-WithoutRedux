const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
     razorpay_order_id: String,
     razorpay_payment_id: String,
     razorpay_signature: String,
     uid: String,
     amount: Number,
     order_id: String,
     currency: String,
     order_created_at: Number,
     amount_due: Number,
     amount_paid: Number,
     attempts: Number,
     timestamp: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
