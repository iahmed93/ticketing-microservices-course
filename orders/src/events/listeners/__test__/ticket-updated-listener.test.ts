import { TicketCreatedEvent, TicketUpdatedEvent } from "@islamahmed93/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
    // create instance of listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        title: 'concert'
    });
    
    await ticket.save();

    // create fake event data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        price: 99,
        title: 'new concert',
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    // create fake Message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg, ticket}
}

it('should finds, updates, and saves a ticket', async() => {
    const {msg, data, ticket, listener } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('should ack a message', async() => {
    const {listener, data, msg, ticket} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('should not call ack if there is a skipped version', async () => {
    const {listener, data, msg, ticket} = await setup();
    data.version = 12;
    try {
        await listener.onMessage(data, msg);
    } catch (error) {
        
    }
    expect(msg.ack).not.toHaveBeenCalled();
} )