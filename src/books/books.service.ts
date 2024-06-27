
import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIBooks, TSBooks, books, } from "../drizzle/schema";

export const booksService = async (limit?: number): Promise<TSBooks[] | null> => {
    if (limit) {
        return await db.query.books.findMany({
            limit: limit
        });
    }
    return await db.query.books.findMany();
}

export const getbookservice = async (id: number): Promise<TIBooks | undefined> => {
    return await db.query.books.findFirst({
        where: eq(books.id, id)
    })
}

export const createbookservice = async (book: TIBooks) => {
    await db.insert(books).values(book)
    return "book created successfully";
}

export const updatebookservice = async (id: number, book: TIBooks) => {
    await db.update(books).set(book).where(eq(books.id, id))
    return "book updated successfully";
}

export const deletebookservice = async (id: number) => {
    await db.delete(books).where(eq(books.id, id))
    return "book deleted successfully";
}

// GET BOOKS BY AUTHOR
 export const getBooksByAuthor = async (author: string): Promise<TIBooks[] | null> => {
    return await db.query.books.findMany({
        where: eq(books.author, author)
    })
}