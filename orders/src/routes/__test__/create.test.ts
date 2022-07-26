import {app} from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { signin } from '../../test/auth-helper';
import { natsWrapper } from '../../nats-wrapper';
import { Order, Ticket } from '../../models';
import { OrderStatus } from '@islamahmed93/common';

it('should return an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();
    await request(app)
        .post('/api/orders')
        .set("Cookie", signin())
        .send({
            ticketId
        })
        .expect(404)
})
it('should return an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 10
    });
    await ticket.save();
    const order = Order.build({
        userId: 'adfafajl1k2jlad',
        status: OrderStatus.Created,
        ticket,
        expiresAt: new Date()
    });
    await order.save();
    await request(app)
        .post('/api/orders')
        .set("Cookie", signin())
        .send({
            ticketId: ticket.id
        })
        .expect(400)
})

it('should reserve a ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 10
    });
    await ticket.save();
    await request(app)
        .post('/api/orders')
        .set("Cookie", signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201)
});

it('should emit an order created event', async() => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 10
    });
    await ticket.save();
    await request(app)
        .post('/api/orders')
        .set("Cookie", signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});