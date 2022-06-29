import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/auth-helper';

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

it('should return 404 if ticket not found', async () => {
    return request(app).get('/api/tickets/62bc22155a456e456f119834').send().expect(404);
})

it('should the ticket if the ticket is found', async () => {
    const  title = 'test';
    const price = 10;

    const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
        title,
        price
    })
    .expect(201);
    const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
})

it('should return all tickets', async () => {
    await createTicket('test', 10);
    await createTicket('test', 10);
    await createTicket('test', 10);

    const ticketResponse = await request(app).get(`/api/tickets`).send().expect(200);

    expect(ticketResponse.body.length).toEqual(3);
})