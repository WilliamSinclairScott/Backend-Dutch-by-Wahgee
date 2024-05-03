import mongoose from 'mongoose';
import Participant from '../models/participantModel.js';
import Divvy from '../models/divvyModel.js';
import User from '../models/userModel.js';



//not in use
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
    const divvy = await Divvy.findById(req.params.id)
    if (!divvy) {
      return res.status(404).json({ message: 'Divvy not found' })
    }
    //make a fake user
    const fakeUser = { email: 'guest@wahgee.com', displayName: 'Guest', Divvys : [divvy]  };
      res.status(200).json(fakeUser)
  } catch (error) {
      res.status(500).json({ message: 'Error getting divvy', error: error.message })
  }
}

/**
 * 
 * @param {*} req An array of all participants (including the owner)
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

    const newDivvy = new Divvy({
      divvyName : divvyName, 
      owner: owner, 
      participants: newParticipants}
    )

    await newDivvy.save();
    const ownerUser = await User.findByIdAndUpdate(owner, 
      { $push: { Divvys : newDivvy } },
      { new: true })
    await ownerUser.save();
    const populated = await ownerUser.populate('Divvys');
    const { _id, email, displayName, Divvys} = populated;
    const response = { userID: _id, email, displayName, Divvys };
    res.status(201).json(response)
  } catch (error) {
      res.status(500).json({ message: 'Error creating divvy', error: error.message });
  }
};

/**
 *  add delete participant and change name of divvy/participants
 * [ {}, {namechanged} , 'bob'}]
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
    const updatedParticipants = participants.map(participant => {
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
    //get user of divvy
    const user = await User.findById(divvy.owner);
    const populated = await user.populate('Divvys');
    const { _id, email, displayName, Divvys} = populated;
    const response = { userID: _id, email, displayName, Divvys };
    res.status(201).json(response);
  } catch (error) {
      res.status(500).json({ message: 'Error updating divvy', error: error.message });
  }
}
//delete divvy function
export const deleteDivvy = async (req, res) => {
  try {
    //remove the divvy id in the owners Divvy array
    const owner = await User.findOne({ Divvys: req.params.id });
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    owner.Divvys = owner.Divvys.filter(divvy => divvy.toString() !== req.params.id);
    await owner.save();
    //delete the divvy
    const deleteDivvy = await Divvy.findByIdAndDelete(req.params.id);
    if (!deleteDivvy) {
      return res.status(404).json({ message: 'Divvy not found' });
    }
    //get user of divvy
    const populated = await owner.populate('Divvys');
    const { _id, email, displayName, Divvys} = populated;
    const response = { userID: _id, email, displayName, Divvys };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting divvy', error: error.message });
  }
}
