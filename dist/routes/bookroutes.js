"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = __importDefault(require("express"));
const Books_1 = __importStar(require("../models/Books"));
const router = express_1.default.Router();
// 1. Create Book
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, genre, isbn, description, copies, available } = req.body;
        const book = new Books_1.default({
            title,
            author,
            genre,
            isbn,
            description,
            copies,
            available,
        });
        yield book.save();
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: error.errors ? error : error.message,
        });
    }
}));
// 2. Get All Books with filter/sort/limit
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filterGenre = req.query.filter;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sort === "desc" ? -1 : 1;
        const limit = parseInt(req.query.limit) || 10;
        const filter = {};
        if (filterGenre && Object.values(Books_1.Genre).includes(filterGenre)) {
            filter.genre = filterGenre;
        }
        const books = yield Books_1.default.find(filter)
            .sort({ [sortBy]: sortOrder })
            .limit(limit);
        res.json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to retrieve books",
            success: false,
            error: error instanceof Error ? error.message : error,
        });
    }
}));
// 3. Get Book by ID
router.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const book = yield Books_1.default.findById(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
            return;
        }
        res.json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve book",
            error: error instanceof Error ? error.message : error,
        });
    }
}));
// 4. Update Book
router.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const updateData = req.body;
        const updatedBook = yield Books_1.default.findByIdAndUpdate(bookId, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedBook) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
            return;
        }
        res.json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update book",
            error: error instanceof Error ? error.message : error,
        });
    }
}));
// 5. Delete Book
router.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const deletedBook = yield Books_1.default.findByIdAndDelete(bookId);
        if (!deletedBook) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
            return;
        }
        res.json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete book",
            error: error instanceof Error ? error.message : error,
        });
    }
}));
exports.default = router;
