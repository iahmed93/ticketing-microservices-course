import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;

    protected ackWait = 5000;

    constructor(private client: Stan){}

    subscriptionOptions(){
        return this.client.subscriptionOptions()
            .setManualAckMode(true)
            .setDeliverAllAvailable()
            .setDurableName(this.queueGroupName)
            .setAckWait(this.ackWait);
    }


    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string'? JSON.parse(data) : JSON.parse(data.toString('utf-8'));
    }
    
    listen() {
        const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on('message', (msg: Message) => {
            console.log(`Message recieved : ${this.subject} / ${this.queueGroupName}`);
            const data = this.parseMessage(msg);
            this.onMessage(data, msg);
        });
    }
}
