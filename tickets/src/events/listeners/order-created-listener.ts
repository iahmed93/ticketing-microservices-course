import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@islamahmed93/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = "tickets-service";
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error("Ticket not found");
        }
        ticket.set({orderId: data.id});
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