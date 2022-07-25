import mongoose from "mongoose";


interface TicketAttributes {
  title: string;
  price: number;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attr: TicketAttributes): TicketDocument;
}

export interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
}

const TicketSchema = new mongoose.Schema(
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

TicketSchema.statics.build = (attr: TicketAttributes) => {
  return new Ticket(attr);
};


export const Ticket = mongoose.model<TicketDocument, TicketModel>("Ticket", TicketSchema);
