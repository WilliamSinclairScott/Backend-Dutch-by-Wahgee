import Divvy from "../models/divvyModel";

// Update a divvy by adding a new participant
export const addParticipant = (req, res) => {
  // TODO: Implement add participant logic
};

// Update a participant's details within a divvy
export const updateParticipant = (req, res) => {
  // TODO: Implement update participant logic
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
