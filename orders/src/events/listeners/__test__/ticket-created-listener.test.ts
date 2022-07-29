import { TicketCreatedEvent } from "@islamahmed93/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models";
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"

const setup = async () => {
    // create instance of listener
    const listener = new TicketCreatedListener(natsWrapper.client);
    // create fake event data object
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        title: 'concert',
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    // create fake Message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg}
}
it('should create and save a ticket', async() => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('should ack a message', async() => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})