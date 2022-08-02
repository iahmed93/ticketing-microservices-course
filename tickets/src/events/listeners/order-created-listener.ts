import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@islamahmed93/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models";

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
        msg.ack();
    }
    
}