import sqlite3 from "sqlite3";
import { createClient } from "../api/client";
import { syncQuery as query } from "./api";
import { initDb, storeSync } from "./db";
import { dbToSchema } from "./schema";

export const buildSchema = async (project: string, token: string) => {
  const db = new sqlite3.Database(":memory:");

  try {
    await initDb(db);
    const client = createClient(project, token);

    const res = await client.query({ query });

    await storeSync(db, res.data.sync.nodes);

    const schema = await dbToSchema(db);

    return schema;
  } finally {
    db.close();
  }
};
