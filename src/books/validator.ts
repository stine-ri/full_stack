import { integer } from 'drizzle-orm/pg-core'
import { z } from 'zod'


export const booksSchema = z.object({

  id: z.number(),
  title: z.string(),
  author: z.string(),
  year: z.string(),

})

