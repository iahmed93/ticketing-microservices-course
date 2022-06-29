import { NotFoundError } from '@islamahmed93/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});
   
    res.send(tickets);
});

router.get('/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new NotFoundError();
    res.send(ticket);
});


export {router as readTicketsRouter}