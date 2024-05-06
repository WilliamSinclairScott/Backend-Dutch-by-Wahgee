import mongoose from 'mongoose';

export const transactionSchema = new mongoose.Schema({
  transactionName: {
    type: String,
    //unique : true,
    required: true
  },
  date: {
    type: Date,
    required: false,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  paidBy: {
    type: String,
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