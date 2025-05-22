const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 2))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const index = parseInt(req.params.isbn)
  if (books[index]) {
    res.send(JSON.stringify(books[index], null, 2))
  } else {
    res.send("No book with this ISBN found")
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  const bookList = Object.values(books).filter(book => book.author === author)
  if (bookList.length > 0) {
    res.send(JSON.stringify(bookList, null, 2))
  } else {
    res.send("No books found for this author")
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const bookList = Object.values(books).filter(book => book.title === title)
  if (bookList.length > 0) {
    res.send(JSON.stringify(bookList, null, 2))
  } else {
    res.send("No books found with this title")
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
