import Divvy from "../models/divvyModel";
import Participant from "../models/participantModel";
import Transaction from "../models/transactionModel";
import { addParticipant } from "participantController.js"
/**
  *divvyRouter.post('/:id/transactions', createTransaction);
  *divvyRouter.put('/:id/transactions/:transactionId', updateTransaction);
  *divvyRouter.get('/:id/transactions', deleteTransaction);
*/

//divvyRouter.post('/:id/transactions', createTransaction);
export const createTransaction = async (req, res) => {
  
  try { 
    //getting ID from the route
    const { divvyId } = req.params;
    //getting data from the request
    const { paidBy, breakdown, transactionName } = req.body
    const theirPart //!!ADD ME!!












//forEach name in breakdown, assign owesWho to name. 
    const newParticipants = breakdown.map(owesWho => {
      if (owesWho.name) {
        Participant.findOneAndUpdate(
          owesWho.name,
          {
          $push: { owesWho: {
            participant : paidBy , 
            amount : theirPart , 
            forWhat : transactionName
          } }
          }
          , { new: true });
      }
      //if the owesWho is new,i.e.there is no _id, create a new owesWho object
      return new owesWho(owesWho);
    })

















    const transaction = new Transaction(transactionData)
    const savedTransaction = await transaction.save();
    const divvy = await Divvy.findByIdAndUpdate(
      divvyId,
      { $push: { transactions: savedTransaction._id } },
      { new: true }
    ).populate('participants transactions');
    if (!divvy) {
      return res.status(404).json({ message: 'Divvy not found' });
  }
  res.status(201).json({
    message: 'Transaction created successfully',
    divvy,
    transaction: savedTransaction
  });
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
}

function updateTransactionInDivvy(req, res) {
  // TODO: Implement logic to update the details of an existing transaction within a divvy
}

function deleteTransactionFromDivvy(req, res) {
  // TODO: Implement logic to delete a transaction from a divvy
}