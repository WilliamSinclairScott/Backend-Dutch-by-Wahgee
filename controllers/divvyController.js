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

/**
 * @param {*} req PUT THE OWNER NAME IN THE PARTICIPANTS ARRAY
 * @param {*} res 
 */
export const createDivvy = async (req, res) => {
  try {
    const {divvyName, owner, participants} = req.body;
    //participants is always an array of strings
    (await User.findById(owner)) ? null : res.status(404).json({ message: 'Owner not found' });
    //make a participant for every participant in the participants array
    const newParticipants = participants.map( participant => {
      return new Participant({ participantName : participant});
    });

    console.log('newParticipants: ', newParticipants)

    const newDivvy = new Divvy({
      divvyName : divvyName, 
      owner: owner, 
      participants: newParticipants}
    )

    console.log('newDivvy: ', newDivvy)
    await newDivvy.save();
    const ownerUser = await User.findByIdAndUpdate(owner, 
      { $push: { Divvys : newDivvy } },
      { new: true })
    console.log(ownerUser)
    await ownerUser.save();
    const response = await ownerUser.populate('Divvys');
    res.status(201).json(response)
  } catch (error) {
      res.status(500).json({ message: 'Error creating divvy', error: error.message });
  }
};

/**
 *  add delete participant and change name of divvy/participants
 *  !!CANNOT DELETE PARTICIPANT IF OWESWHO IS NOT EMPTY
 * @param {*} req HAND ME ALL THE PARTICIPANTS, even the ones that arn't changed
 * @param {*} res 
 * @returns 
 */
//
export const updateDivvy = async (req, res) => {
  try {
    //desconstruct the req.body object
    const { id } = req.params;
    const {divvyName, owner, participants } = req.body;
    //find the divvy by id
    const divvy = await Divvy.findById(id);
    if (!divvy) {
      return res.status(404).json({ message: 'Divvy not found' });
    }
    //see if name needs to change
    if (divvy.divvyName !== divvyName) {
      divvy.divvyName = divvyName;
    }
    // map the participants
    console.log(divvy.participants)
    const updatedParticipants = participants.map(participant => {
      console.log('participant: ', participant)
      //check if this participant is a string, or the participant Object
      if (typeof participant === 'string') {
          return new Participant({ participantName: participant });
      } else {
        //if the participant is an object, find the participant by id
        const existingParticipant = divvy.participants.find(p => p._id.equals(participant._id));
        //if the participant is not found, create a new participant
        //!! this is a catch all and just shouldnt happen
        if (!existingParticipant) {
          throw new Error('Participant ID not in this divvy');
          //return new Participant({ participantName: participant.participantName });
        } else {
          //if the participant is found, update the participant
          if (existingParticipant.participantName !== participant.participantName) {
            existingParticipant.participantName = participant.participantName;
          }
          return existingParticipant;
        }
      }
    })

    //find owner
    const ownerUser = await User.findById(owner);
    if (!ownerUser) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    //override the divvy participants with the updated participants
    divvy.participants = updatedParticipants;
    //save the divvy
    await divvy.save();
    const response = await ownerUser.populate('Divvys');
    res.status(201).json(response)
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
