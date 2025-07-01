import express, { Request, Response, Router } from "express";
import Borrow from "../models/borrow.model";
import Book from "../models/Books";
import mongoose from "mongoose";

const router: Router = express.Router();

// POST /borrow
interface BorrowRequestBody {
  quantity: number;
  dueDate: string;
}

router.post(
  "/:bookId",
  async (
    req: Request<{ bookId: string }, {}, BorrowRequestBody>,
    res: Response
  ): Promise<void> => {
    try {
      const { bookId } = req.params;
      const { quantity, dueDate } = req.body;

      if (!bookId || !quantity || !dueDate) {
        res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({
          success: false,
          message: "Invalid book ID",
        });
        return;
      }

      const book = await Book.findById(bookId);
      if (!book) {
        res.status(404).json({
          success: false,
          message: "Book not found",
        });
        return;
      }

      try {
        await book.decreaseCopies(quantity);
      } catch (error: any) {
        res.status(400).json({
          success: false,
          message: error.message || "Cannot borrow book",
        });
        return;
      }

      const borrow = new Borrow({ book: bookId, quantity, dueDate });
      await borrow.save();

      res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: borrow,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to borrow book",
        error: error.message,
      });
    }
  }
);

// GET /borrow-summary
router.get(
  "/borrow-summary",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const summary = await Borrow.aggregate([
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

      res.status(200).json({
        success: true,
        message: "Borrow summary retrieved successfully",
        data: summary,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve summary",
        error: error.message,
      });
    }
  }
);

export default router;
