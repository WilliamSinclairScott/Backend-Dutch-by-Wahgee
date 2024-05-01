import mongoose from 'mongoose';
import Participant from '../models/participantModel.js';
import Divvy from '../models/divvyModel.js';
import User from '../models/userModel.js';



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
/**
 * 
 * @param {*} req PUT THE OWNER NAME IN THE PARTICIPANTS ARRAY
 * @param {*} res 
 */
export const createDivvy = async (req, res) => {
  try {
    const {divvyName, owner, participants} = req.body;
    //participants is always an array of strings
    (await User.findById(owner)) ? null : res.status(404).json({ message: 'Owner not found' });
    //make a participant for every participant in the participants array
    const newParticipants = participants.map( async participant => {
      return new Participant({ participantName : participant});
    });
    await Promise.all(newParticipants)

    console.log('newParticipants: ', newParticipants)
    let newDivvy = new Divvy({
      divvyName : divvyName, 
      owner: owner, 
      participants: newParticipants}
    )
    newDivvy = await newDivvy.populate();
    await newDivvy.save();
    const ownerUser = await User.findByIdAndUpdate(owner, 
      { $push: { Divvys : newDivvy } },
      { new: true })
    console.log(ownerUser)
    await ownerUser.save();
    res.status(201).json(ownerUser).populate('Divvys');
  } catch (error) {
      res.status(500).json({ message: 'Error creating divvy', error: error.message });
  }
};

//update divvy function
// add delete participant and change name of divvy/participants
//!!CANNOT DELETE PARTICIPANT IF OWESWHO IS NOT EMPTY
export const updateDivvy = async (req, res) => {
  try {
    //desconstruct the req.body object
    const {divvyName, userID, owner, participants, owesWho} = req.body;
    
    //foreach participant in the participants array, see if they are already a participant
    const updatedParticipants = await Promise.all(participants.map(async participantName => {
      const updatedParticipant = await Participant.findOneAndUpdate(
        { participantName },
        { participantName, userID: userID ? mongoose.Types.ObjectId(userID) : null },
        { new: true, upsert: true }
      );
      return updatedParticipant._id; // Return the ObjectId reference of the updated participant
    }));
    //wait for all promises
    const updatedDivvy = await Divvy.findByIdAndUpdate(
      req.params.id,
      {
        divvyName,
        owner,
        participants: updatedParticipants, // Use updatedParticipants instead of newParticipants
        owesWho: owesWho ? owesWho : [] // Ensure proper handling of owesWho field
      },
      { new: true }
    );
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
