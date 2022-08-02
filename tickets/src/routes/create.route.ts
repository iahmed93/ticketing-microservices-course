import { requireAuth, validateRequest } from "@islamahmed93/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { Ticket } from "../models";
import { natsWrapper } from "../nats-wrapper";


const router = express.Router();

const bodySchema = [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0')
]

router.post('/', 
requireAuth, 
bodySchema, validateRequest,
async (req: Request, res: Response) => {

    const {title, price} = req.body;
    const ticket = Ticket.build({
        title, price, userId: req.currentUser!.id
    })
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        version: ticket.version,
    })
    res.status(201).send(ticket);
    
});


export {router as createTicketRouter}