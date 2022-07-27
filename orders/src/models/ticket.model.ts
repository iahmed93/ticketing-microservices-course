import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface TicketAttributes {
  id: string;
  title: string;
  price: number;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attr: TicketAttributes): TicketDocument;
}

export interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    version: number;
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
  return new Ticket({_id: attr.id, ...attr});
};

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

export const Ticket = mongoose.model<TicketDocument, TicketModel>("Ticket", ticketSchema);
