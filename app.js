//Sequelize Setup
const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "library.db"
});

// Book model
class Book extends Sequelize.Model {}
Book.init(
  {
    title: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: '"Title" is required.'
        }
      }
    },
    author: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: { msg: '"Author" is required.' }
      }
    },
    genre: { type: Sequelize.STRING },
    year: {
      type: Sequelize.INTEGER,
      validate: {
        isInt: { msg: '"Year" must be a valid integer.' }
      }
    }
  },
  { sequelize }
);

//async IIFE
(async () => {
  await sequelize.sync();

  try {
  } catch (error) {
    console.error("Error connecting to database: ", error);
  }
})();

// Handler function for each route
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).render("error", {
        status: "500",
        heading: "Server Error"
      });
    }
  };
}

//Express Setup
const express = require("express");
const app = express();
app.set("views", "./public/views");
app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Express Routes
//ALL BOOKS
app.get(
  "/",
  asyncHandler(async (req, res) => {
    res.redirect("/books");
  })
);

app.get(
  "/books",
  asyncHandler(async (req, res) => {
    Book.findAll().then(books => {
      res.render("index", { heading: "Books", books: books });
    });
  })
);

//*********************
//*ADD NEW BOOK
//*********************
app.get(
  "/books/new",
  asyncHandler(async (req, res) => {
    res.render("new_book", { heading: "Create New Book" });
  })
);

app.post(
  "/books/new",
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

app.get(
  "/books/:id/edit",
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

app.post(
  "/books/:id/edit",
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
app.post(
  "/books/:id/delete",
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

//404 Error
app.use((req, res, next) => {
  const err = new Error(
    "Sorry, we couldn't find the page you were looking for."
  );
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render("page_not_found", { heading: "Page Not Found" });
});

app.listen(5500, () => console.log("App listening on port 5500"));
