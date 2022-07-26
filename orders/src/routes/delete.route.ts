import { NotFoundError, NotAuthorizedError, OrderStatus } from '@islamahmed93/common';
import express, { Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Order } from '../models';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/:id', async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    order.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id
        }
    })
    res.status(204).send(order);
});

export {router as deleteOrderRouter};