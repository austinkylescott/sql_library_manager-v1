const Sequelize = require("sequelize");

//* Book model
module.exports = sequelize => {
  class Book extends Sequelize.Model {}
  Book.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
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

  return Book;
};
