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
const express_1 = __importDefault(require("express"));
const borrow_model_1 = __importDefault(require("../models/borrow.model"));
const Books_1 = __importDefault(require("../models/Books"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
const borrowBookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book: bookId, quantity, dueDate } = req.body;
        if (!bookId || !quantity || !dueDate) {
            res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
            res.status(400).json({
                success: false,
                message: "Invalid book ID",
            });
            return;
        }
        const book = yield Books_1.default.findById(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
            return;
        }
        try {
            yield book.decreaseCopies(quantity);
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || "Cannot borrow book",
            });
            return;
        }
        const borrow = new borrow_model_1.default({ book: bookId, quantity, dueDate });
        yield borrow.save();
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to borrow book",
            error: error.message,
        });
    }
});
router.post("/", borrowBookHandler);
//get korsi
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.default.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo",
                },
            },
            { $unwind: "$bookInfo" },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookInfo.title",
                        isbn: "$bookInfo.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve borrowed books summary",
            error: error.message,
        });
    }
}));
exports.default = router;
