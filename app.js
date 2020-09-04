//Express Setup
const express = require("express");
const app = express();
const path = require("path");
const sequelize = require("./models").sequelize;

const routes = require("./routes/index");
const books = require("./routes/books");

//async IIFE
(async () => {
  await sequelize.sync();

  try {
  } catch (error) {
    console.error("Error connecting to database: ", error);
    throw error;
  }
})();

//Establish Routes and views
app.use("/static", express.static(path.join(__dirname, "/public")));
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", routes);
app.use("/books", books);

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

module.exports = app;
