
import { Hono } from "hono";
import { listbooks, getBook, createBook, updateBook, deleteBook,getAllBooksByAuthor } from "./books.controller"
import { zValidator } from "@hono/zod-validator";
import { booksSchema } from "./validator"; 

export const bookRouter = new Hono();
//get all books

bookRouter.get("/books", listbooks)
//get a single book   api/books/1
bookRouter.get("/books/:id", getBook)
// create a book 
bookRouter.post("/books", zValidator('json', booksSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createBook)
//update a book
bookRouter.put("/books/:id", updateBook) 

bookRouter.delete("/books/:id", deleteBook)

//get books by author

bookRouter.get("/books/author/:author", getAllBooksByAuthor)
