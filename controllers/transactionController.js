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
    const { paidBy, breakdown, transactionName, amount } = req.body
    

//foreach person that was involved in the transaction,
// assign percentage their responsible for,
// and if not participant, now they are (see upsert)
    const newParticipants = breakdown.map(async participantInfo => {

      return await Participant.findOneAndUpdate(
        // Assuming 'participantInfo' can be a string or an object containing a name and theirPart.
        { name:  typeof participantInfo === 'string' ? 
        participantInfo : participantInfo.name },
        // Find or create participant using 'findOneAndUpdate' with 'upsert' option
        {
          $push: { 
            owesWho: {
              participant: paidBy,
              amount: participantInfo.percentage * amount,
              forWhat: transactionName
            }
          }}, 
          { new: true, upsert: true })
    });
    

    
    // Use Promise.all to handle all the operations
    Promise.all(newParticipants)
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