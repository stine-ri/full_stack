import { Context } from "hono";
import { booksService, getbookservice, createbookservice, updatebookservice, deletebookservice, getBooksByAuthor } from "./books.service";
import*as bcrypt from "bcrypt";
export const listbooks = async (c: Context) => {
    try {
        //limit the number of books to be returned

        const limit = Number(c.req.query('limit'))

        const data = await booksService(limit);
        if (data == null || data.length == 0) {
            return c.text("book not found", 404)
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const getBook = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const book = await getbookservice(id);
    if (book == undefined) {
        return c.text("Book not found", 404);
    }
    return c.json(book, 200);
}
export const createBook = async (c: Context) => {
    try {
        const book = await c.req.json();
        // const password=book.password;
        // const hashedPassword=await bcrypt.hash(password,10);
        // book.password=hashedPassword;
        const createdbook = await createbookservice(book);


        if (!createdbook) return c.text("Book not created", 404);
        return c.json({ msg: createdbook }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const updateBook = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const book = await c.req.json();
    try {
        // search for the user
        const searchedBook= await getbookservice(id);
        if (searchedBook == undefined) return c.text("Book not found", 404);
        // get the data and update it
        const res = await updatebookservice(id, book);
        // return a success message
        if (!res) return c.text("Book not updated", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}

export const deleteBook = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        //search for the book
        const book = await getbookservice(id);
        if (book== undefined) return c.text("Book not found", 404);
        //deleting the book
        const res = await deletebookservice(id);
        if (!res) return c.text("Book not deleted", 404);

        return c.json({ msg: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400)
    }
}
 
 
//get all books by author
export const getAllBooksByAuthor = async (c: Context) => {
    const author = c.req.param("author");
    try {
        if (!author) return c.text("Invalid author", 400);
        //search for book
        const books = await getBooksByAuthor(author);
        if (books === null) return c.text("Books not found", 404);
        return c.json(books, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}