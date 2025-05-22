const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const alreadyExists = (username)=>{ //returns boolean
  //write code to check if the username already exists
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }

  if(!authenticatedUser(username,password)){
    return res.status(401).json({message: "Invalid username or password"});
  }

  let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });
  req.session.authorization = {
    accessToken, username
  }
  return res.send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }
  
  if (!isbn || !review) {
    return res.status(400).json({ message: "ISBN and review are required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;
  return res.send("Review added successfully");
});

module.exports.authenticated = regd_users;
module.exports.alreadyExists = alreadyExists;
module.exports.users = users;
