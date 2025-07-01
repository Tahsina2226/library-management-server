import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBorrow extends Document {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BorrowSchema = new Schema<IBorrow>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

BorrowSchema.pre("save", function (next) {
  console.log(
    `📘 About to borrow ${this.quantity} copy/copies of book ID: ${this.book}`
  );
  next();
});

BorrowSchema.post("save", function (doc) {
  console.log(`✅ Borrowed book successfully. Borrow ID: ${doc._id}`);
});

const Borrow = mongoose.model<IBorrow>("Borrow", BorrowSchema);
export default Borrow;
