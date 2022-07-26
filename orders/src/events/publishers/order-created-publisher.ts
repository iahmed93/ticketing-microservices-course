import { OrderCreatedEvent, Publisher, Subjects } from "@islamahmed93/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}