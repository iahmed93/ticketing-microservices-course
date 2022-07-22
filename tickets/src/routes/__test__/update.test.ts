import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/auth-helper';
import { natsWrapper } from '../../nats-wrapper';

function createTicket(title: string, price: number) {
    return request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
        title,
        price
    })
    .expect(201);
}


it('should return 404 if the provided id does not exist', async () => {
    return request(app)
        .put('/api/tickets/62bc22155a456e456f119834')
        .set('Cookie', signin())
        .send({
            title: 'test',
            price: 10
        })
        .expect(404);
});

it('should return 401 if the user is not authenticated', async () => {
    return request(app)
        .put('/api/tickets/62bc22155a456e456f119834')
        .send({
            title: 'test',
            price: 10
        })
        .expect(401);
});

it('should return 401 if the user does not own the ticket', async () => {
    const response = await createTicket('test', 10);
    return request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin('5678'))
    .send({
        title: 'test',
        price: 10
    })
    .expect(401);
});

it('should return 400 if the user provides an invalid title or price', async () => {
    const response = await createTicket('test', 10);
    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({
        title: 'test',
        price: -10
    })
    .expect(400);

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({
        title: '',
        price: 10
    })
    .expect(400);
});

it('should update the ticket for the provided valid inputs', async () => {
    const response = await createTicket('test', 10);
    const updateResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', signin())
        .send({
            title: 'test',
            price: 20
        })
        .expect(200);
    expect(updateResponse.body.price).toEqual(20);
});

it('should publish ticket updated event' , async() => {
    const response = await createTicket('test', 10);
    const updateResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', signin())
        .send({
            title: 'test',
            price: 20
        })
        .expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});