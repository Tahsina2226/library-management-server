import mongoose, { Schema, Document, Model } from "mongoose";

export enum Genre {
  FICTION = "FICTION",
  NON_FICTION = "NON_FICTION",
  SCIENCE = "SCIENCE",
  HISTORY = "HISTORY",
  BIOGRAPHY = "BIOGRAPHY",
  FANTASY = "FANTASY",
}

export interface IBook extends Document {
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  decreaseCopies(quantity: number): Promise<void>;
}

const BookSchema: Schema<IBook> = new Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    author: { type: String, required: [true, "Author is required"] },
    genre: {
      type: String,
      enum: Object.values(Genre),
      required: [true, "Genre is required"],
    },
    isbn: { type: String, required: [true, "ISBN is required"], unique: true },
    description: { type: String },
    copies: {
      type: Number,
      required: [true, "Copies are required"],
      min: [0, "Copies must be a non-negative number"],
    },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BookSchema.methods.decreaseCopies = async function (
  quantity: number
): Promise<void> {
  if (this.copies < quantity) {
    throw new Error("Not enough copies available");
  }
  this.copies -= quantity;
  if (this.copies === 0) {
    this.available = false;
  }
  await this.save();
};

const Book: Model<IBook> = mongoose.model<IBook>("Book", BookSchema);

export default Book;
