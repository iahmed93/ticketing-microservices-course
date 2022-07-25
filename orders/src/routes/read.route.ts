import { requireAuth } from '@islamahmed93/common';
import express, { Request, Response } from 'express';
import { Order } from '../models';

const router = express.Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');

    res.send(orders);
});

router.get('/:id', (req: Request, res: Response) => {
    res.send({});
});

export {router as readOrderRouter};