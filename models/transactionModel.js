import mongoose from 'mongoose';

export const transactionSchema = new mongoose.Schema({
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
    name: {
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
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction 