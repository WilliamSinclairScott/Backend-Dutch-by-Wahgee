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
export const deleteParticipant = (req, res) => {
  // TODO: Implement delete participant logic
};

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
