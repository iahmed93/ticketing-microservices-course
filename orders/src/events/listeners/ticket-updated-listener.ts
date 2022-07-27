import { Listener, Subjects, TicketUpdatedEvent } from "@islamahmed93/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = 'order-service' ;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
        console.log(data);
        
        const {id, title, price} = data;
        
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            throw new Error('Ticket Not Found');
        }
        
        ticket.set({title, price});
        await ticket.save();
        
        msg.ack();
    }
}