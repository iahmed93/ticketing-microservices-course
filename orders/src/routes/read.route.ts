import { NotAuthorizedError, NotFoundError, requireAuth } from '@islamahmed93/common';
import express, { Request, Response } from 'express';
import { Order } from '../models';

const router = express.Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');

    res.send(orders);
});

router.get('/:id', async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    res.send(order);
});

export {router as readOrderRouter};