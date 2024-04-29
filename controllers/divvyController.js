import Divvy from '../models/divvyModel';
import mongoose from 'mongoose';

export const getAllDivvys = async (req, res) => {
  try {
    const divvys = await Divvy.find().populate('participants transactions')
      res.status(200).json(divvys)
  } catch (error) {
      res.status(500).json({ message: 'Error getting divvys', error: error.message })
  }
}
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
export const createDivvy = async (req, res) => {
  try {
    const newDivvy = new Divvy(req.body);
    await newDivvy.save();
      res.status(201).json(newDivvy);
  } catch (error) {
      res.status(500).json({ message: 'Error creating divvy', error: error.message });
  }
};
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

function addParticipantToDivvy(req, res) {
  // TODO: Implement logic to add a new participant to a divvy
}

function updateParticipantInDivvy(req, res) {
  // TODO: Implement logic to update a participant's details within a divvy
}

function deleteParticipantFromDivvy(req, res) {
  // TODO: Implement logic to delete a participant from a divvy
}

function createTransactionInDivvy(req, res) {
  // TODO: Implement logic to create a new transaction within a divvy
}

function getTransactionsInDivvy(req, res) {
  // TODO: Implement logic to get all transactions associated with a specific divvy
}

function updateTransactionInDivvy(req, res) {
  // TODO: Implement logic to update the details of an existing transaction within a divvy
}

function deleteTransactionFromDivvy(req, res) {
  // TODO: Implement logic to delete a transaction from a divvy
}
