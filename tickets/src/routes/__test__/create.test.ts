import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models';
import { signin } from '../../test/auth-helper';
import { natsWrapper } from '../../nats-wrapper';


it('should has a route handler listening to /api/tickets for post requests', async() => {
    const response = await request(app)
        .post("/api/tickets")
        .send({});
    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async() => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({});
    expect(response).not.toEqual(401);
});

it('should return an error if an invalid title is provided', async() => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title: '',
            price: 10
        })
        .expect(400);
    await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            price: 10
        })
        .expect(400);
});

it('should return an error if an invalid price is provided', async() => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title: 'test',
            price: -10
        })
        .expect(400);
    await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title: 'test',
        })
        .expect(400);
});

it('should create a ticket with valid inputs', async() => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
        title: 'test',
        price: 10
    })
    .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(10);
    expect(tickets[0].title).toEqual('test');
});

it('should publish ticket created event' , async() => {
    await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
        title: 'test',
        price: 10
    })
    .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})