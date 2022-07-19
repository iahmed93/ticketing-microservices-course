import nats, {Message} from 'node-nats-streaming';
import { randomBytes } from 'crypto';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222',
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    })

    const options = stan.subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('xyz');

    const subscription = stan.subscribe('ticket:created', 'order-service-queue-group', options);
    subscription.on('message', (msg: Message) => {
        console.log(msg.getSequence());
        console.log(msg.getData());
        console.log('Message recieved');
        msg.ack();
    });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());