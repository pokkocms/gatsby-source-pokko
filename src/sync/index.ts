import sqlite3 from "sqlite3";
import { createClient } from "../api/client";
import { syncQuery as query } from "./api";
import { initDb, storeSync } from "./db";
import { dbToSchema } from "./schema";
import { printSchema } from "graphql";

export const sync = async () => {
  const db = new sqlite3.Database(":memory:");

  try {
    await initDb(db);
    const client = createClient(
      "87a71e8f-e9a9-44e7-9035-f6e4b524d9fe",
      "b3lCqJVzQaKr70C/Fpx/MWNz/3i1POcOqaVWHhLE"
    );

    const res = await client.query({ query });

    await storeSync(db, res.data.sync.nodes);

    const schema = await dbToSchema(db);

    console.log(printSchema(schema));
  } finally {
    db.close();
  }
};

sync();
