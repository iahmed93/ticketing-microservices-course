import { OrderStatus } from "@islamahmed93/common";
import mongoose from "mongoose";
import { TicketDocument } from "./ticket.model";

// describes the properties that create new order
interface OrderAttributes {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
}

// describes the properties that a saved order document has
interface OrderDocument extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
    version: number;
}

// describes the properties that overall model has
interface OrderModel extends mongoose.Model<OrderDocument> {
    build(attr: OrderAttributes) : OrderDocument;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.statics.build = (attrs: OrderAttributes) => {
    return new Order(attrs);
}

export const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);