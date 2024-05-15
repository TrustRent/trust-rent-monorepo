// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  index,
  integer,
  pgTableCreator,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `trust-rent_${name}`);

export const posts = createTable(
  "RentalAgreement",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    rentAmount: integer("rentAmount"),
    sdAmount: integer("sdAmount"),
    startDate: integer("startDate"),
    endDate: integer("endDate"),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);
