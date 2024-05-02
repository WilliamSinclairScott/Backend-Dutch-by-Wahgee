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
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    forWhat: {
      type: String,
      required: true
    }
  }],
});

const Participant = mongoose.model('Participant', participantSchema);
export default Participant