import { Publisher } from "@islamahmed93/common";
import { Subjects } from "@islamahmed93/common";
import { TicketUpdatedEvent } from "@islamahmed93/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}