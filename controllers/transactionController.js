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
    if (!divvy) {
      return res.status(404).json({ message: 'Divvy not found' });
  }
    //getting data from the request
    const { paidBy, breakdown, transactionName, amount } = req.body
    

//foreach person that was involved in the transaction,
// assign percentage their responsible for,
// and if not participant, now they are (see upsert)
    const involvedParticipants = breakdown.map(async participantInfo => {

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
    Promise.all(involvedParticipants)
    //make new transaction subdocument
    const transaction = new Transaction(req.body)
    const divvy = await Divvy.findByIdAndUpdate(
      divvyId,
      { $push: { transactions: transaction } },
      { new: true })
    
  res.status(201).json(divvy); 
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
}
//divvyRouter.put('/:id/transactions/:transactionId', updateTransaction);
  export const updateTransaction = async (req, res) => {
try {
  //getting divvyID and transactionID from the route
  const { divvyId, transactionId } = req.params
  const transactionUpdates = req.body
} 
  }


function deleteTransactionFromDivvy(req, res) {
  // TODO: Implement logic to delete a transaction from a divvy
}