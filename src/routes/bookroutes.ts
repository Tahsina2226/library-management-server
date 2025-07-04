import express, { Request, Response } from "express";
import Book, { Genre } from "../models/Books";

const router = express.Router();

// 1. Create Book
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, genre, isbn, description, copies, available } =
      req.body;

    const isAvailable = copies > 0 ? available ?? true : false;

    const book = new Book({
      title,
      author,
      genre,
      isbn,
      description,
      copies,
      available: isAvailable,
    });

    await book.save();

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: error.errors ? error : error.message,
    });
  }
});

// 2. Get All Books with pagination
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const filterGenre = req.query.filter as string | undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sort as string) === "desc" ? -1 : 1;

    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (filterGenre && Object.values(Genre).includes(filterGenre as Genre)) {
      filter.genre = filterGenre;
    }

    const books = await Book.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalBooks = await Book.countDocuments(filter);

    res.json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
      pagination: {
        total: totalBooks,
        page,
        limit,
        totalPages: Math.ceil(totalBooks / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve books",
      success: false,
      error: error instanceof Error ? error.message : error,
    });
  }
});

// 3. Get Book by ID
router.get("/:bookId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve book",
      error: error instanceof Error ? error.message : error,
    });
  }
});

// 4. Update Book
router.put("/:bookId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId } = req.params;
    const updateData = req.body;

    if ("copies" in updateData) {
      updateData.available = updateData.copies > 0;
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, {
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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update book",
      error: error instanceof Error ? error.message : error,
    });
  }
});

// 5. Delete Book
router.delete(
  "/:bookId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;
      const deletedBook = await Book.findByIdAndDelete(bookId);

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
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete book",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
);

export default router;
