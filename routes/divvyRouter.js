import express from 'express';
import {
  //TODO: Make functions in divvyController.js
  getAllDivvys,
  getDivvyById,
  createDivvy,
  createDivvy,
  updateDivvy,
} from '../controllers/divvyController.js';

const divvyRouter = express.Router();
// GET all divvys
divvyRouter.get('/', getAllDivvys);

// GET a specific divvy
divvyRouter.get('/:id', getDivvyById);

// POST a new divvy
divvyRouter.post('/', createDivvy);

// PUT/update an existing divvy
divvyRouter.put('/:id', updateDivvy);

// DELETE an divvy
divvyRouter.delete('/:id', deleteDivvy);
export default divvyRouter;