import mongoose from 'mongoose';

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
      type: String,
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

const Participant = mongoose.model('Participant', new mongoose.Schema({
  participantName: {
    type: String,
    unique: true,
    required: true
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  owesWho: [{
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Participant',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    forWhat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true
    }
  }],
}));

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

export default Divvy = mongoose.model('Divvy', divvySchema);