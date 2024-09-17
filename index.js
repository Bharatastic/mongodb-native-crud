const express = require("express");
const { connectToDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");
const PORT = 3000;

const app = express();
app.use(express.json());

let db;

connectToDB((err) => {
    if(!err) {
        app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        });
        db = getDB();
    }
});

app.get("/books", (req, res) => {

    // Pagination Code 
    const page = req.query.p || 0;
    const booksPerPage = 3;
    // Pagination Code 

    let books = [];

    db.collection("books")
        .find()
        .sort({ author: 1 })

        // Pagination Code 
        .skip(page * booksPerPage) 
        .limit(booksPerPage) 
        // Pagination Code 
        
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({
                error: "Document is not found"
            })
        })
});

app.get("/books/:id", (req, res) => {
    const bookID = req.params.id;
    if (ObjectId.isValid(bookID)) {
        db.collection("books")
        .findOne({ _id: new ObjectId(bookID) })
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({
                error: "Document is not found"
            })
        })
    } else {
        res.status(500).json({
            error: "Not a valid Book ID"
        })
    }
})

app.post("/books", (req, res) => {
    const book = req.body;

    db.collection("books")
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({
                err: "Could not created a new document"
            })
        })
})

app.patch("/books/:id", (req, res) => {
    const updates = req.body;
    const bookID = req.params.id;
    if (ObjectId.isValid(bookID)) {
        db.collection("books")
            .updateOne({ _id: new ObjectId(bookID) }, {$set: updates})
            .then(result => {
                res.status(200).json(result)
            })
            .catch (err => {
                res.status(500).json({
                    error: "Could not update the document"
                })
            })
    } else {
        res.status(500).json({
            error: "Not a valid book ID"
        })
    }
})

app.delete("/books/:id", (req, res) => {
    const bookID = req.params.id;
    if (ObjectId.isValid(bookID)) {
        db.collection("books")
            .deleteOne({ _id: new ObjectId(bookID) })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({
                    error: "Could not delete the document"
                })
            })
    } else {
        res.status(500).json({
            error: "Not a valid Book ID"
        })
    }
})