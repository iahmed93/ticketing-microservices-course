import { OrderCancelledEvent, Publisher, Subjects } from "@islamahmed93/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}