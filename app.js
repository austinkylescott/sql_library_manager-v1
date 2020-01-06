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
        notEmpty: true
      }
    },
    author: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      }
    },
    genre: { type: Sequelize.STRING },
    year: {
      type: Sequelize.INTEGER,
      validate: {
        isInt: true
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
      res.status(500).send(error);
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
    const book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  })
);
//*********************
//*UPDATE EXISTING BOOK
//*********************

app.get(
  "/books/:id",
  asyncHandler(async (req, res) => {
    Book.findByPk(req.params.id).then(book => {
      res.render("book_detail", {
        heading: "Update Existing Book",
        book: book
      });
    });
  })
);

app.post(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect("/books/" + book.id);
  })
);

//*********************
//*DELETE BOOK
//*********************
app.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books");
  })
);

// //404 Error
// app.use(function(err, req, res, next) {
//   console.error(err.stack);
//   res.status(404).render("ERROR ERROR ERROR");
// });

app.listen(5500, () => console.log("App listening on port 5500"));
