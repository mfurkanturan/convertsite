import { pgTable, uuid, text, bigint, integer, timestamp } from 'drizzle-orm/pg-core';
export const filesTable = pgTable('files', {
  id: uuid().primaryKey(), owner: text().notNull(), size: bigint({ mode: 'number' }).notNull(),
  pages: integer().notNull(), status: text().notNull(),
  kind: text({ enum: ['pdf','docx','xlsx','jpg','png','zip','txt'] }).notNull().default('pdf'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
