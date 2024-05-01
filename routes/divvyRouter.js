import express from 'express';

import {
  getAllDivvys,
  createDivvy,
  getDivvyById,
  updateDivvy,
  deleteDivvy,
} from '../controllers/divvyController.js';

import {
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js';

import { authCheck } from '../utils/auth.js';

const divvyRouter = express.Router();

//Divvy Routes
divvyRouter.get('/', getAllDivvys);
divvyRouter.get('/:id', getDivvyById); //
divvyRouter.post('/', createDivvy); //
divvyRouter.patch('/:id', updateDivvy); //
divvyRouter.delete('/:id', deleteDivvy);

//Transaction Routes
divvyRouter.post('/:id/transactions', createTransaction); // 
divvyRouter.put('/:id/transactions/:transactionId', updateTransaction);
divvyRouter.get('/:id/transactions', deleteTransaction);

export default divvyRouter;