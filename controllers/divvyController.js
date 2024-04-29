import Divvy from '../models/divvyModel';
import mongoose from 'mongoose';

//get all divvys function
export const getAllDivvys = async (req, res) => {
  try {
    const divvys = await Divvy.find().populate('participants transactions')
      res.status(200).json(divvys)
  } catch (error) {
      res.status(500).json({ message: 'Error getting divvys', error: error.message })
  }
}
//get divvy by id function
export const getDivvyById = async (req, res) => {
  try { 
    const divvy = await Divvy.findById(req.params.id).populate('participants transactions')
    if (!divvy) {
      return res.status(404).json({ message: 'Divvy not found' })
    }
      res.status(200).json(divvy)
  } catch (error) {
      res.status(500).json({ message: 'Error getting divvy', error: error.message })
  }
}
//create divvy function
export const createDivvy = async (req, res) => {
  try {
    const newDivvy = new Divvy(req.body);
    await newDivvy.save();
      res.status(201).json(newDivvy);
  } catch (error) {
      res.status(500).json({ message: 'Error creating divvy', error: error.message });
  }
};
//update divvy function
export const updateDivvy = async (req, res) => {
  try {
    const updatedDivvy = await Divvy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDivvy) {
      return res.status(404).json({ message: 'Divvy not found' });
    }
      res.status(200).json(updatedDivvy);
  } catch (error) {
      res.status(500).json({ message: 'Error updating divvy', error: error.message });
  }
}
//delete divvy function
export const deleteDivvy = async (req, res) => {
  try {
    const deleteDivvy = await Divvy.findByIdAndDelete(req.params.id);
    if (!deleteDivvy) {
      return res.status(404).json({ message: 'Divvy not found' });
    }
    res.status(200).json({ message: 'Divvy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting divvy', error: error.message });
  }
}
//addParticipantToDivvy
  export const addParticipantToDivvy = async (req, res) => {
    try {
      const divvy = await Divvy.findById(req.params.divvyId);
      if (!divvy) {
        return res.status(404).json({ message: 'Divvy not found' });
      } 
      //// Assuming participant details are passed in the request body.
      divvy.participants.push(req.body.participantId);
      await divvy.save();
    res.status(200).json({ message: 'Participant added successfully', divvy });
  } catch (error) {
    res.status(500).json({ message: 'Error adding participant', error: error.message });
  }
};
// updateParticipantInDivvy
export const updateParticipantInDivvy = async (req, res) => {
  const { divvyId, participantId, updatedParticipant } = req.body;
  try {
    const divvy = await Divvy.findById(divvyId);
    if (!divvy) {
      return res.status(404).json({ message: 'Divvy not found' });
    }
    const participantIndex = divvy.participants.findIndex(participant => participant._id === participantId);
    if (participantIndex === -1) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    divvy.participants[participantIndex] = updatedParticipant;
    await divvy.save()
    res.status(200).json(divvy)
  } catch (error) {
    res.status(500).json({ message: 'Error updating participant', error: error.message });
  }
}
//deleteParticipantFromDivvy
export const deleteParticipantFromDivvy = async (req, res) => {
  const { divvyId, participantId } = req.body;
  try {
    const divvy = await Divvy.findByIdAndUpdate(
      divvyId,
      { $pull: { participants: participantId } },
      { new: true }
    ).populate('participants transactions');
    if (!divvy) {
      return res.status(404).json({ message: 'Divvy not found' });
    }
    res.status(200).json({
      message: 'Participant removed successfully',
      divvy
    })
  } catch (error) {
    res.status(500).json({ message: 'Error removing participant', error: error.message });
  }
}
//createTransactionInDivvy
export const createTransactionInDivvy = async (req, res) => {
  const { divvyId } = req.params;
  const transactionData = req.body;
  try {
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
export const getTransactionsInDivvy = async (req, res) => {
  const { divvyId } = req.params;
  try {
    const divvyWithTransactions = await Divvy.findById(divvyId)
    .populate('transactions');
    if (!divvyWithTransactions) {
      return res.status(404).json({ message: 'Divvy not found' });
  }
    if (divvyWithTransactions.transactions.length === 0) {
      return res.status(200).json({ message: 'No transactions found for this divvy', transactions: [] });
  }
  res.status(200).json(divvyWithTransactions.transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error getting transactions', error: error.message });
  }
};

function updateTransactionInDivvy(req, res) {
  // TODO: Implement logic to update the details of an existing transaction within a divvy
}

function deleteTransactionFromDivvy(req, res) {
  // TODO: Implement logic to delete a transaction from a divvy
}
