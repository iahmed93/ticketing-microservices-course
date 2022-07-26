import { OrderStatus } from "@islamahmed93/common";
import  request  from "supertest";
import { app } from "../../app";
import { Order, Ticket } from "../../models";
import { signin } from "../../test/auth-helper";


const createTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 10
    });
    return ticket.save();
}

it('should cancel order of current user', async() => {
    const ticket = await createTicket();
    const user = signin('1');
    const order = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        }).expect(201);
    await request(app)
        .delete(`/api/orders/${order.body.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);
    
    const canceledOrder = await Order.findById(order.body.id);
    expect(canceledOrder!.status).toEqual(OrderStatus.Cancelled);
    
})