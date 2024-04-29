const mongoose = require('mongoose');

const divvySchema = new mongoose.Schema({
  divvyName: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant'
  }],
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }]
});

const Divvy = mongoose.model('Divvy', divvySchema);

module.exports = Divvy;
const Transaction = mongoose.model('Transaction', new mongoose.Schema({
  transactionName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true
  },
  type: {
    type: String,
    enum: ['expense', 'refund', 'reimbursement'],
    required: true
  },
  itemized: {
    type: Boolean,
    default: false
  },
  items: {
    type: [String],
    required: false
  },
  breakdown: [{
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Participant',
      required: true
    },
    percentage: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    }
  }]
}));

module.exports = Transaction;