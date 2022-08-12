import { Listener, OrderCancelledEvent, Subjects } from "@islamahmed93/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = "tickets-service";
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error('Ticket Not Found');
        }
        ticket.set({orderId: undefined});
        await ticket.save();
        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            version: ticket.version,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId
        });
        msg.ack();
    }
}