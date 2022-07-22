import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@islamahmed93/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/ticket-updated-publisher';
import { Ticket } from '../models';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const bodySchema = [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0')
]

router.put('/:id', requireAuth,
bodySchema, validateRequest,
async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new NotFoundError();
    if (ticket.userId != req.currentUser!.id) throw new NotAuthorizedError();

    const {title, price} = req.body;

    ticket.set({
        title, price
    })

    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id : ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    })

    res.send(ticket);
})

export {router as updateTicketsRouter}