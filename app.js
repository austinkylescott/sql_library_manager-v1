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
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
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

//Express Setup
const express = require("express");
const app = express();
app.set("views", "./public/views");
app.set("view engine", "pug");

//Express Routes
//ALL BOOKS
app.get("/", (req, res) => res.redirect("/books"));
app.get("/books", (req, res) =>
  Book.findAll().then(books => {
    res.render("index", { heading: "Books", books: books });
  })
);
//ADD NEW BOOK
app.get("/books/new", (req, res) =>
  res.render("new_book", { heading: "Create New Book" })
);

app.post("/books/new", (req, res) => res.send("/books/new"));

//UPDATE EXISTING BOOK
app.get("/books/:id", (req, res) =>
  Book.findByPk(req.params.id).then(book => {
    res.render("book_detail", { heading: "Update Existing Book", book: book });
  })
);

app.post("/books/:id", (req, res) => res.send("/books/:id"));

//DELETE BOOK
app.post("/books/:id/delete", (req, res) => res.send("/books/:id/delete"));

// //404 Error
// app.use(function(err, req, res, next) {
//   console.error(err.stack);
//   res.status(404).render("ERROR ERROR ERROR");
// });

app.listen(5500, () => console.log("Example app listening on port 5500"));
