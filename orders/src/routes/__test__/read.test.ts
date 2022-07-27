import { Ticket } from "../../models"
import { signin } from "../../test/auth-helper";
import request from 'supertest';
import {app} from '../../app';
import mongoose from "mongoose";

const createTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString()
    });
    return ticket.save();
}

it('should return orders for a particular user', async () => {
    const ticket1 = await createTicket();
    const ticket2 = await createTicket();
    const ticket3 = await createTicket();

    const user1 = signin('1');
    const user2 = signin('2');

    const order1 = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({
            ticketId: ticket1.id
        }).expect(201);
    const order2 = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({
            ticketId: ticket2.id
        }).expect(201);
    const order3 = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({
            ticketId: ticket3.id
        }).expect(201);
    
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .send()
        .expect(200);
    
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(order2.body.id);
    expect(response.body[1].id).toEqual(order3.body.id);
    expect(response.body[0].ticket.id).toEqual(ticket2.id);
    expect(response.body[1].ticket.id).toEqual(ticket3.id);
});

it('should return order of current user', async() => {
    const ticket = await createTicket();
    const user = signin('1');
    const order = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        }).expect(201);
    const response = await request(app)
        .get(`/api/orders/${order.body.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);
    expect(response.body.id).toEqual(order.body.id);
    expect(response.body.ticket.id).toEqual(ticket.id);
})
it('should throw not authorized exception if user request order is not the owner of the order', async() => {
    const ticket = await createTicket();
    const user1 = signin('1');
    const user2 = signin('2');
    const order = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({
            ticketId: ticket.id
        }).expect(201);
    await request(app)
        .get(`/api/orders/${order.body.id}`)
        .set('Cookie', user2)
        .send()
        .expect(401);
})