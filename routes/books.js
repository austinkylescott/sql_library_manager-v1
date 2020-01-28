const express = require("express");
const router = express.Router();
const Book = require("../models").models.Book;

//Async Handler for database errors
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      console.log(error);
      const status = 500 || error.status;
      res.status(status);
      res.render("error", {
        status: "500",
        heading: "Server Error"
      });
    }
  };
}

//*********************
//*ALL BOOKS
//*********************
router.get(
  "/",
  asyncHandler(async (req, res) => {
    Book.findAll().then(books => {
      res.render("index", { heading: "Books", books: books });
    });
  })
);

//*********************
//*ADD NEW BOOK
//*********************
router.get(
  "/new",
  asyncHandler(async (req, res) => {
    res.render("new_book", { heading: "Create New Book" });
  })
);

router.post(
  "/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new_book", {
          book,
          errors: error.errors,
          heading: "Create New Book"
        });
      } else {
        throw error;
      }
    }
  })
);

//*********************
//*UPDATE EXISTING BOOK
//*********************
router.get(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);

    if (book) {
      res.render("book_detail", {
        heading: "Update Existing Book",
        book: book
      });
    } else {
      res.sendStatus(404);
    }
  })
);

router.post(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books");
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = Book.build(req.body);
        book.id = req.params.id;
        res.render("book_detail", {
          heading: "Update Existing Book",
          errors: error.errors,
          book: book
        });
      } else {
        throw error;
      }
    }
  })
);
//*********************
//*DELETE BOOK
//*********************
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = router;
