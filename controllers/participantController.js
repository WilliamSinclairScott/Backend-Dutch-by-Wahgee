import Divvy from "../models/divvyModel";

/**
 *divvyRouter.post('/:id/participants', addParticipant);
 *divvyRouter.patch('/:id/participants/:participantId', updateParticipant);
 *divvyRouter.delete('/:id/participants/:participantId', deleteParticipant);
 */

// Update a divvy by adding a new participant
export const addParticipant = async (req, res) => {
    try {
      const { id } = req.params;
      const { participantName } = req.body;

      

      // Find the divvy
      const divvyInQuestion = await Divvy.findById(id);
      // Create the participant
      const newParticipant = { 
        participantName: participantName,
        owesWho : []
      };
      divvyInQuestion.participants.push(newParticipant);

      // Save the updated divvy
      await divvyInQuestion.save();

      // Respond with the entire divvy
      res.json(divvyInQuestion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Update a participant's details within a divvy
export const updateParticipant = async (req, res) => {
  // TODO: TEST THIS
  try {
    //load id to find which divvy
    const { id, participantId } = req.params;
    const { participantName, userID, owesWho } = req.body;
    //if the participant does not exist, return 404
    owesWho ? owesWho : [];

    // Find the divvy
    const divvyInQuestion = await Divvy.findById(id);
    //if divyInQuestion is null, return 404
    if (!divvyInQuestion) {
      return res.status(404).json({ message: 'Divvy not found' });
    }
    //find the participant in question
    const participantInQuestion = await divvyInQuestion.participants.id(participantId)
    //if participantInQuestion is null, return 404
    if (!participantInQuestion) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    //update the participant if those fields exsist
    participantInQuestion.participantName = participantName ?
      participantName : participantInQuestion.participantName;
    participantInQuestion.userID = userID ? 
      userID : participantInQuestion.userID
    //update the owesWho array with spread operator
    participantInQuestion.owesWho.push(...owesWho);

    // Save the updated divvy
    await divvyInQuestion.save();

    // Respond with the entire divvy
    res.json(divvyInQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a participant from a divvy
export const deleteParticipant = async (req, res) => {
  // TODO: Test this
  try {
    const { id, participantId } = req.params;
    const divvyInQuestion = await Divvy.findById(id);
    if (!divvyInQuestion) {
      return res.status(404).json({ message: 'Divvy not found' });
    }
    const participantInQuestion = divvyInQuestion.participants.id(participantId);
    if (!participantInQuestion) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    participantInQuestion.remove();
    await divvyInQuestion.save();
    res.json(divvyInQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
