import express from 'express';
import {
  //TODO: Make functions in eventController.js
  getAllEvents,
  getEventById,
  createEvent,
  createEvent,
  updateEvent,
} from '../controllers/eventController.js';

const eventRouter = express.Router();
// GET all events
eventRouter.get('/', getAllEvents);

// GET a specific event
eventRouter.get('/:id', getEventById);

// POST a new event
eventRouter.post('/', createEvent);

// PUT/update an existing event
eventRouter.put('/:id', updateEvent);

// DELETE an event
eventRouter.delete('/:id', deleteEvent);
export default eventRouter;