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

      //TODO : check if the participant exists

      // Find the divvy
      const divvyInQuestion = await Divvy.findById(id);
      // Create the participant
      const newParticipant = { name: participantName };
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
  // TODO: Implement update participant logic
  try {
    const { id } = req.params;
    const { participantName } = req.body;

    //TODO : check if the participant exists

    // Find the divvy
    const divvyInQuestion = await Divvy.findById(id);
    // Create the participant
    const newParticipant = { name: participantName };
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

// Delete a participant from a divvy
export const deleteParticipant = async (req, res) => {
  // TODO: Implement delete participant logic
};
