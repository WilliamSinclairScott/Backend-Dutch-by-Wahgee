import Divvy from "../models/divvyModel.js";
import Participant from "../models/participantModel.js";
import Transaction from "../models/transactionModel.js";
/**
  *divvyRouter.post('/:id/transactions', createTransaction);
  *divvyRouter.put('/:id/transactions/:transactionId', updateTransaction);
  *divvyRouter.get('/:id/transactions', deleteTransaction);
*/

//divvyRouter.post('/:id/transactions', createTransaction);
export const createTransaction = async (req, res) => {
  
  try { 
    //getting ID from the route
    const { id } = req.params;
    console.log(id)
    
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
    await transaction.save(); // save the transaction to database
    console.log(transaction)
    const divvy = await Divvy.findByIdAndUpdate(
      id,
      { $push: { transactions: transaction.id } },

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
  //find all users in the Divvy
  const divvy = await Divvy.findById(divvyId)
  //if participant in divvy has an owesWho.forWhat that matches the transactionId remove it
  const participants = divvy.participants.map(async participant => {
    participant.owesWho = participant.owesWho.filter(owe => owe.forWhat !== transactionId)
  })
  // Use Promise.all to handle all the operations 
  Promise.all(participants)

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
      const transaction = new Transaction(transactionUpdates) 
      //update the transaction
      const updatedDivvy = await Divvy.findByIdAndUpdate(
        divvyId,
        { $pull: { transactions: { _id: transactionId } }, 
          $push: { transactions: transaction } },
        { new: true }
      );
      updatedDivvy.transactions.push(transaction);
      await updatedDivvy.save();
  res.status(200).json(updatedDivvy)

} catch (error) {
  res.status(500).json({ message: 'Error updating transaction', error: error.message });
}
  }

export const deleteTransaction = async (req, res) => {
  try {
    const { divvyId, transactionId } = req.params;
    const divvy = await Divvy.findById(divvyId);
    const updated = divvy.transactions.filter(transaction => transaction._id !== transactionId);
    divvy.transactions = updated;
    await divvy.save();
    res.status(200).json(divvy);
} catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
}
}
