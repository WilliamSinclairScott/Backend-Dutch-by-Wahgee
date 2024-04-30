import Divvy from "../models/divvyModel";
import Participant from "../models/participantModel";
import Transaction from "../models/transactionModel";

// Update a divvy by adding a new participant
//ROUTE: /:id/participants
//TODO: Test this
export const addParticipant = async (req, res) => {
    try {
      // Find the divvy
      const divvyInQuestion = await Divvy.findById(req.params.id);
      // if no divvy, 404 divvy not found
      if (!divvyInQuestion) {
        return res.status(404).json({ message: 'Divvy not found' });
      }
      // Create a new participant
      const newParticipant = new Participant(req.body);
      // Add the new participant to the divvy
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
//ROUTE: /:id/participants/:participantId
// TODO: Test this
export const updateParticipant = async (req, res) => {
  try {
    // Find the divvy
    const divvyInQuestion = await Divvy.findById(req.params.id);
    // If no divvy, 404 divvy not found
    if (!divvyInQuestion) {
      return res.status(404).json({ message: 'Divvy not found' });
    }
    // Find the participant in the array participants of the divvy
    const participantInQuestion = divvyInQuestion.participants.id(req.params.participantId);
    // If no participant, 404 participant not found
    if (!participantInQuestion) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    // Update the participant
    participantInQuestion.set(req.body);

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
// ROUTE: /:id/participants/:participantId
// TODO: Test this
export const deleteParticipant = async (req, res) => {
  try {
    // Find the divvy
    const divvyInQuestion = await Divvy.findById(req.params.id);
    // If no divvy, 404 divvy not found
    if (!divvyInQuestion) {
      return res.status(404).json({ message: 'Divvy not found' });
    }
    // Find the participant in the array participants of the divvy
    const participantInQuestion = divvyInQuestion.participants.id(req.params.participantId);
    // If no participant, 404 participant not found
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