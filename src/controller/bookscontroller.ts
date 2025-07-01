import { Request, Response, NextFunction } from "express";
import Book from "../models/Books";
export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    next(error);
  }
};

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, author, genre, isbn, description, copies } = req.body;

    if (copies < 0)
      return res.status(400).json({ message: "Copies cannot be negative" });

    const book = new Book({
      title,
      author,
      genre,
      isbn,
      description,
      copies,
      available: copies > 0,
    });

    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, author, genre, isbn, description, copies, available } =
      req.body;

    if (copies < 0)
      return res.status(400).json({ message: "Copies cannot be negative" });

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.title = title ?? book.title;
    book.author = author ?? book.author;
    book.genre = genre ?? book.genre;
    book.isbn = isbn ?? book.isbn;
    book.description = description ?? book.description;
    book.copies = copies ?? book.copies;
    book.available = copies === 0 ? false : available ?? book.available;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (error) {
    next(error);
  }
};
