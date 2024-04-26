import express from 'express';
import {
  //TODO: Make functions in eventController.js

} from '../controllers/eventController.js';

const eventRouter = express.Router();

// GET all events
eventRouter.get('/', );

// GET a specific event
eventRouter.get('/:id',);

// CREATE a new event
eventRouter.post('/',);

// UPDATE an existing event
eventRouter.put('/:id',);

// DELETE an event
eventRouter.delete('/:id',);

export default eventRouter;