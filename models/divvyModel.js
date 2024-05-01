import mongoose from 'mongoose';
import {participantSchema} from './participantModel.js';
import {transactionSchema} from './transactionModel.js';


export const divvySchema = new mongoose.Schema({
  divvyName: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [participantSchema],
  transactions: [transactionSchema]
})

// divvySchema.pre('save', async function(next) {
//   try {

//     const populatedDivvy = await this.populate('participants transactions').execPopulate();
//     this.participants = populatedDivvy.participants;
//     this.transactions = populatedDivvy.transactions;

//     const ownerUser = await User.findById(this.owner)
//     ownerUser.Divvys.push(this._id)
//     await ownerUser.save()
//     next()
//   } catch (error) {
//     next(error)
//   }
// })

const Divvy = mongoose.model('Divvy', divvySchema)


export default Divvy;