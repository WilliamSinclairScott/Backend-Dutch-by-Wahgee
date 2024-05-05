import Divvy from "../models/divvyModel.js";
import Participant from "../models/participantModel.js";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";


export const createTransaction = async (req, res) => {
  
  try { 
    //getting ID from the route
    const { id } = req.params;
    
    //getting data from the request
    const { transactionName, amount, paidBy, type, breakdown } = req.body
    
    //Get the divvy by ID
    const divvy = await Divvy.findById(id)
    //if diviv is not found, return 404
    if (!divvy) {
      return res.status(404).json({ message: 'Divvy not found' });
    }
    
    // Create an array for each person involved in the transaction
    const promisedWork = breakdown.map(async personOfInterest => {
      try {
        const existingParticipant = await divvy.participants.find(divParticipant => divParticipant.participantName === personOfInterest.name);
        if (existingParticipant) {
          existingParticipant.owesWho.push({
            name: paidBy,
            amount: personOfInterest.percentage * amount,
            forWhat: transactionName
          });
        } else {
          divvy.participants.push({
            participantName: personOfInterest.name,
            owesWho: [{
              name: paidBy,
              amount: personOfInterest.percentage * amount,
              forWhat: transactionName
            }]
          });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error creating owesWho', error: error.message });
      }
    });

    // Wait for all the promises to resolve
    await Promise.all(promisedWork);

    // Make new transaction subdocument
    const transaction = new Transaction({ transactionName, amount, paidBy, type, breakdown });

    // Update the transaction
    divvy.transactions.push(transaction);
    await divvy.save();
    //get user of divvy
    const user = await User.findById(divvy.owner);
    const populated = await user.populate('Divvys');
    const { _id, email, displayName, Divvys} = populated;
    const response = { userID: _id, email, displayName, Divvys };
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
}


export const updateTransaction = async (req, res) => {
try {
  //getting divvyID and transactionID from the route
  const { id, transactionId } = req.params
  const { transactionName, amount, paidBy, type, breakdown } = req.body
  //find all users in the Divvy
  const divvy = await Divvy.findById(id)

  //if divvy is not found, return 404
  if (!divvy) {
    return res.status(404).json({ message: 'Divvy not found' });
  }

  //if participant in divvy has an owesWho.forWhat that matches the transactionName remove it

  const participants = divvy.participants.map(async participant => {
    participant.owesWho = await participant.owesWho.filter( owe => {
      owe.forWhat !== transactionName})
      return participant
  })

  // Use Promise.all to handle all the operations 
  const updatedParticipants = await Promise.all(participants);

  //update the participants in the divvy with the updated participants
  divvy.participants = updatedParticipants;

  //find the transaction in the divvy
  const transaction = divvy.transactions.id(transactionId)

  //update the transaction
  transaction.transactionName = transactionName ? transactionName : transaction.transactionName;
  transaction.amount = amount ? amount : transaction.amount;
  transaction.paidBy = paidBy ? paidBy : transaction.paidBy;
  transaction.type = type ? type : transaction.type;
  transaction.breakdown = breakdown ? breakdown : transaction.breakdown;

  //save to the divvy
  divvy.transactions.id(transactionId).set(transaction);
  //reapply the breakdown to the participants
  console.log(breakdown)
  // Create an array for each person involved in the transaction
  const promisedWork = breakdown.map( async personOfInterest => {
    try {
      const existingParticipant = divvy.participants.find(divParticipant => {
        return divParticipant.participantName === personOfInterest.name ? divParticipant : null;
      });

      if (existingParticipant) {
        existingParticipant.owesWho.push({
          name: transaction.paidBy,
          amount: personOfInterest.percentage * transaction.amount,
          forWhat: transaction.transactionName
        });
        return existingParticipant;
      } else {
        divvy.participants.push(new Participant({participantName: personOfInterest.name, owesWho: [{
          name: transaction.paidBy,
          amount: personOfInterest.percentage * transaction.amount,
          forWhat: transaction.transactionName
        }]}));
        return divvy.participants[divvy.participants.length - 1];
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating owesWho', error: error.message });
    }
  });

  // Wait for all the promises to resolve
  const updated = await Promise.all(promisedWork);
  //find the participant in the divvy who wern't in the breakdown
  const participantsNotInBreakdown = divvy.participants.filter(participant => {
    return !updated.includes(participant);
  });
  console.log('participants Not in Breakdown',participantsNotInBreakdown)
  //concat the participants not in the breakdown to the updated participants
  const finalParticipantArray = updated.concat(participantsNotInBreakdown);

  console.log('finalParticipantArray',finalParticipantArray)
  //update the divvy with the final participant array
  divvy.participants = finalParticipantArray;

  console.log('divvy.participants',divvy.participants)
  //save the divvy
  await divvy.save();
  //get user of divvy
  const user = await User.findById(divvy.owner);
  const populated = await user.populate('Divvys');
  const { _id, email, displayName, Divvys} = populated;
  const response = { userID: _id, email, displayName, Divvys };
  console.log('response',response.Divvys[0].participants)
  res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction', error: error.message });
  }
}

export const deleteTransaction = async (req, res) => {
  try {
    //getting divvyID and transactionID from the route
    const { id, transactionId } = req.params
    //find all users in the Divvy
    const divvy = await Divvy.findById(id)

    //if divvy is not found, return 404
    if (!divvy) {
      return res.status(404).json({ message: 'Divvy not found' });
    }

    //find the transaction in the divvy
    const transaction = divvy.transactions.id(transactionId)

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const { transactionName } = transaction;
    //if participant in divvy has an owesWho.forWhat that matches the transactionName remove it
    const participants = divvy.participants.map(async participant => {
      participant.owesWho = await participant.owesWho.filter( owe => {
        owe.forWhat !== transactionName})
        return participant
    })

    // Use Promise.all to handle all the operations 
    const updatedParticipants = await Promise.all(participants);

    //update the participants in the divvy with the updated participants
    divvy.participants = updatedParticipants;

    //pull the transaction
    divvy.transactions.pull(transaction);
    //save the divvy
    await divvy.save();
    //get user of divvy
    const user = await User.findById(divvy.owner);
    const populated = await user.populate('Divvys');
    const { _id, email, displayName, Divvys} = populated;
    const response = { userID: _id, email, displayName, Divvys };
    res.status(200).json(response);
} catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
}
}
