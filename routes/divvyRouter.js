import express from 'express';

import {
  getAllDivvys,
  createDivvy,
  getDivvyById,
  updateDivvy,
  deleteDivvy,
} from '../controllers/divvyController.js';

import {
  addParticipant,
  updateParticipant,
  deleteParticipant,
} from '../controllers/participantController.js';

import {
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js';

import { authCheck } from '../utils/auth.js';

const divvyRouter = express.Router();

//Divvy Routes
divvyRouter.get('/', getAllDivvys);
divvyRouter.get('/:id', getDivvyById);
divvyRouter.post('/', createDivvy);
divvyRouter.patch('/:id', updateDivvy);
divvyRouter.delete('/:id', deleteDivvy);

//Participant Routes
divvyRouter.post('/:id/participants', addParticipant);
divvyRouter.patch('/:id/participants/:participantId', updateParticipant);
divvyRouter.delete('/:id/participants/:participantId', deleteParticipant);

//Transaction Routes
divvyRouter.post('/:id/transactions', createTransaction);
divvyRouter.put('/:id/transactions/:transactionId', updateTransaction);
divvyRouter.get('/:id/transactions', deleteTransaction);

export default divvyRouter;