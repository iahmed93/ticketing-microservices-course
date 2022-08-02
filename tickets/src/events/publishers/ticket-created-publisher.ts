import { Publisher } from "@islamahmed93/common";
import { Subjects } from "@islamahmed93/common";
import { TicketCreatedEvent } from "@islamahmed93/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}