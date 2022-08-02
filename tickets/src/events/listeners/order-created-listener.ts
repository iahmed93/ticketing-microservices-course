import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@islamahmed93/common";
import { Message } from "node-nats-streaming";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = "tickets-service";
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        
    }
    
}