import Divvy from "../models/divvyModel";

// Create a new transaction within a divvy
export const createTransaction = (req, res) => {
  // TODO: Implement create transaction logic
};

// Update the details of an existing transaction within a divvy
export const updateTransaction = (req, res) => {
  // TODO: Implement update transaction logic
};

// Delete a transaction from a divvy
export const deleteTransaction = (req, res) => {
  // TODO: Implement delete transaction logic
};

//createTransactionInDivvy
export const createTransactionInDivvy = async (req, res) => {
  const { divvyId } = req.params;
  const transactionData = req.body;
  try {
    const transaction = new Transaction(transactionData)
    const savedTransaction = await transaction.save();
    const divvy = await Divvy.findByIdAndUpdate(
      divvyId,
      { $push: { transactions: savedTransaction._id } },
      { new: true }
    ).populate('participants transactions');
    if (!divvy) {
      return res.status(404).json({ message: 'Divvy not found' });
  }
  res.status(201).json({
    message: 'Transaction created successfully',
    divvy,
    transaction: savedTransaction
  });
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
}
export const getTransactionsInDivvy = async (req, res) => {
  const { divvyId } = req.params;
  try {
    const divvyWithTransactions = await Divvy.findById(divvyId)
    .populate('transactions');
    if (!divvyWithTransactions) {
      return res.status(404).json({ message: 'Divvy not found' });
  }
    if (divvyWithTransactions.transactions.length === 0) {
      return res.status(200).json({ message: 'No transactions found for this divvy', transactions: [] });
  }
  res.status(200).json(divvyWithTransactions.transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error getting transactions', error: error.message });
  }
};

function updateTransactionInDivvy(req, res) {
  // TODO: Implement logic to update the details of an existing transaction within a divvy
}

function deleteTransactionFromDivvy(req, res) {
  // TODO: Implement logic to delete a transaction from a divvy
}