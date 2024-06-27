import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import db, { client } from "./db";

async function migration() {
  console.log("======migration started=====");
  console.log("Database URL:", process.env.DATABASE_URL);
  console.log("Migrations Folder:", __dirname + "/migrations");
  try {
    await migrate(db, { migrationsFolder: __dirname + "/migrations" });
    console.log("Migrations applied successfully.");
  } catch (err) {
    console.log("Error during migration:", err);
  }
  await client.end();
  console.log("=====migration ended=====");
  process.exit(0);
}

migration().catch((err) => {
  console.log("Error in migration script:", err);
  process.exit(1);
});
