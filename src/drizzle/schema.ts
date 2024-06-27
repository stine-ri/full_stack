import { pgTable, text, integer,serial} from 'drizzle-orm/pg-core';

export const books = pgTable('books', {
//   id: integer('id').primaryKey().autoIncrement(),
  id:serial('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  year: integer('year').notNull(),
});



export type TIBooks = typeof books.$inferInsert;
export type TSBooks = typeof books.$inferSelect;