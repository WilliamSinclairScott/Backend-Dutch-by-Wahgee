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

// Read the details of a specific divvy
export const getDivvyById = (req, res) => {
  // TODO: Implement get divvy by ID logic
};

// Create a new divvy
export const createDivvy = (req, res) => {
  // TODO: Implement create divvy logic
};

// Update the details of an existing divvy
export const updateDivvy = (req, res) => {
  // TODO: Implement update divvy logic
};

// Delete an existing divvy
export const deleteDivvy = (req, res) => {
  // TODO: Implement delete divvy logic
};