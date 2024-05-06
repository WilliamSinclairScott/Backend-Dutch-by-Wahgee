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
divvyRouter.get('/', authCheck, getAllDivvys);
divvyRouter.get('/:id', getDivvyById);
divvyRouter.post('/', authCheck, createDivvy);
divvyRouter.patch('/:id', authCheck, updateDivvy); 
divvyRouter.delete('/:id', authCheck, deleteDivvy);

//Transaction Routes
divvyRouter.post('/:id/transaction', authCheck, createTransaction); // 
divvyRouter.patch('/:id/transaction/:transactionId', authCheck, updateTransaction);
divvyRouter.delete('/:id/transaction/:transactionId', authCheck, deleteTransaction);

export default divvyRouter;