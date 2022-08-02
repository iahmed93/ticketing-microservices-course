import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attr: TicketAttributes): TicketDocument;
}

interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attr: TicketAttributes) => {
  return new Ticket(attr);
};

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);


export const Ticket = mongoose.model<TicketDocument, TicketModel>("Ticket", ticketSchema);
