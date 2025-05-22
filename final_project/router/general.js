const express = require('express');
let books = require("./booksdb.js");
let alreadyExists = require("./auth_users.js").alreadyExists;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }

  if(alreadyExists(username)){
    return res.status(400).json({message: "User already exists"});
  }
  const user = {
    username: username,
    password: password
  }
  users.push(user);
  return res.send("User registered successfully");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const getAllBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  });

  getAllBooks.then((books) => {
    res.send(JSON.stringify(books, null, 2));
  }).catch((error) => {
    res.status(500).send(error);
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const getBookByISBN = new Promise((resolve, reject) => { 
    const index = parseInt(req.params.isbn)
    if (books[index]) {
      resolve(books[index]);
    } else {
      reject("No book with this ISBN found");
    }
  });
  
  getBookByISBN.then((book) => {
    res.send(JSON.stringify(book, null, 2));
  }
  ).catch((error) => {
    res.status(404).send(error);
  });
}); 
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const getBookByAuthor = new Promise((resolve, reject) => {
    const author = req.params.author
    const bookList = Object.values(books).filter(book => book.author === author)
    if (bookList.length > 0) {
      resolve(bookList);
    } else {
      reject("No books found with this author");
    }
  });

  getBookByAuthor.then((bookList) => {
    res.send(JSON.stringify(bookList, null, 2));
  }).catch((error) => {
    res.status(404).send(error);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const getBookByTitle = new Promise((resolve, reject) => {
    const title = req.params.title
    const bookList = Object.values(books).filter(book => book.title === title)
    if (bookList.length > 0) {
      resolve(bookList);
    } else {
      reject("No books found with this title");
    }
  });
  
  getBookByTitle.then((bookList) => {
    res.send(JSON.stringify(bookList, null, 2));
  }).catch((error) => {
    res.status(404).send(error);
  });
});  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const index = parseInt(req.params.isbn)
  if (books[index]) {
    if (Object.keys(books[index].reviews).length === 0) {
      res.send("No reviews for this book")
    } else {
      res.send(JSON.stringify(books[index].reviews, null, 2))
    }
  } else {
    res.send("No book with this ISBN found")
  }
});

module.exports.general = public_users;
