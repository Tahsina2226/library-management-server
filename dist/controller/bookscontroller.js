"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getBooks = void 0;
const Books_1 = __importDefault(require("../models/Books"));
const getBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Books_1.default.find().sort({ createdAt: -1 });
        res.json(books);
    }
    catch (error) {
        next(error);
    }
});
exports.getBooks = getBooks;
const getBookById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Books_1.default.findById(req.params.id);
        if (!book)
            return res.status(404).json({ message: "Book not found" });
        res.json(book);
    }
    catch (error) {
        next(error);
    }
});
exports.getBookById = getBookById;
const createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, genre, isbn, description, copies } = req.body;
        if (copies < 0)
            return res.status(400).json({ message: "Copies cannot be negative" });
        const book = new Books_1.default({
            title,
            author,
            genre,
            isbn,
            description,
            copies,
            available: copies > 0,
        });
        const savedBook = yield book.save();
        res.status(201).json(savedBook);
    }
    catch (error) {
        next(error);
    }
});
exports.createBook = createBook;
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, genre, isbn, description, copies, available } = req.body;
        if (copies < 0)
            return res.status(400).json({ message: "Copies cannot be negative" });
        const book = yield Books_1.default.findById(req.params.id);
        if (!book)
            return res.status(404).json({ message: "Book not found" });
        book.title = title !== null && title !== void 0 ? title : book.title;
        book.author = author !== null && author !== void 0 ? author : book.author;
        book.genre = genre !== null && genre !== void 0 ? genre : book.genre;
        book.isbn = isbn !== null && isbn !== void 0 ? isbn : book.isbn;
        book.description = description !== null && description !== void 0 ? description : book.description;
        book.copies = copies !== null && copies !== void 0 ? copies : book.copies;
        book.available = copies === 0 ? false : available !== null && available !== void 0 ? available : book.available;
        const updatedBook = yield book.save();
        res.json(updatedBook);
    }
    catch (error) {
        next(error);
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Books_1.default.findByIdAndDelete(req.params.id);
        if (!book)
            return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Book deleted" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteBook = deleteBook;
