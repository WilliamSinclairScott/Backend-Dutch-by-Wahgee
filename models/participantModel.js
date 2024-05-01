import mongoose from 'mongoose';

export const participantSchema = new mongoose.Schema({
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
});

const Participant = mongoose.model('Participant', participantSchema);
export default Participant