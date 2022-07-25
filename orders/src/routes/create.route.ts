import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@islamahmed93/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order, Ticket } from '../models';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const bodySchema = [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Ticket Id is required')
];

router.post('/', requireAuth, bodySchema, validateRequest, async (req: Request, res: Response) => {
    const {ticketId} = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }

    const existingOrder = await Order.findOne({
        ticket,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Completed
            ]
        }
    });

    if (existingOrder) {
        throw new BadRequestError('Ticket reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });

    await order.save();

    res.status(201).send(order);
});

export {router as createOrderRouter};