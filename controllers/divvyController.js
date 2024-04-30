import mongoose from 'mongoose';
import Participant from '../models/participantModel';
import Divvy from '../models/divvyModel';




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
//TODO: Test this
export const createDivvy = async (req, res) => {
  try {
    const {divvyName, owner,participants} = req.body;
    
    //make a participant for every participant in the participants array
    const newParticipants = participants.map( async participant => {
      return await new Participant(participant);
    });
    await Promise.all(newParticipants)
    const newDivvy = new Divvy({
      divvyName : divvyName, 
      owner: owner, 
      participants: newParticipants}
    );
    await newDivvy.save();
      res.status(201).json(newDivvy);
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
    const {divvyName, userID, owner, participants} = req.body;
    
    //foreach participant in the participants array, see if they are already a participant
    const newParticipants = participants.map( async participant => {
      return await Participant.findByIdAndUpdate(participant._id,
        {
          participantName: typeof participant === String ? participant : participant.participantName,
          userID: userID ? mongoose.Types.ObjectId(userID) : null,
          //if the participant is being updated, update the owesWho array based on the new participant object
          owesWho: participant.owesWho
        }, 
        { new: true, upsert: true});
      
      //note: removed if statement and added upsert to reflect across. 
      //If that fails, we can add a check for the participant's existence
      // return await new Participant(participant);
    })
    //wait for all promises
    await Promise.all(newParticipants);

    const updatedDivvy = await Divvy.findByIdAndUpdate(req.params.id, 
      {
        divvyName: divvyName,
        owner: owner,
        //this causes deletion through exclusion
        participants: newParticipants
      }, { new: true });
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
