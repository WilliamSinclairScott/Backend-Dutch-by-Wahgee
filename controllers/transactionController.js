import Divvy from "../models/divvyModel";
import { addParticipant } from "participantController.js"
/**
  *divvyRouter.post('/:id/transactions', createTransaction);
  *divvyRouter.put('/:id/transactions/:transactionId', updateTransaction);
  *divvyRouter.get('/:id/transactions', deleteTransaction);
*/

// Create a new transaction within a divvy
export const createTransaction = async (req, res) => {
  try{
    //find the divvyInQuestion by id
    const divvyInQuestion = await Divvy.findById(req.params.id);
    //check if the divvyInQuestion exists
    if(!divvyInQuestion){
      return res.status(404).json({ message: 'Divvy not found' });
    }
    //check all the participants in the divvyInQuestion to see if the participant in the transaction exists
    const { breakdown } = req.body;
    for (const participant of breakdown) {
      const participantInQuestion = await divvyInQuestion.participants.find(participant.participant);
      //if the participant does not exist, make that participant create a new transaction
      if(!participantInQuestion){
        //make new participant create a new transaction
        const newParticipant = await addParticipant({req}, res);
        //add the new participant to the divvyInQuestion
        divvyInQuestion.participants.push(newParticipant._id);
      }
    const newTransaction = {
      ...req.body,
      divvyInQuestion: req.params.id
    };
    //save the transaction
    const transaction = await Transaction.create(newTransaction);
    //add the transaction to the divvyInQuestion
    divvyInQuestion.transactions.push(transaction._id);
    //save the divvyInQuestion
    await divvyInQuestion.save();
    //return the divvyInQuestion
    res.status(201).json(divvyInQuestion);
  }catch(error){
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  
  }
};

// Update the details of an existing transaction within a divvy
export const updateTransaction = async (req, res) => {
  // TODO: Implement update transaction logic
};

// Delete a transaction from a divvy
export const deleteTransaction = async (req, res) => {
  // TODO: Implement delete transaction logic
};