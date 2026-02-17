import { DatabaseModel } from "./DatabaseModel.mjs";

export class MicroblogModel extends DatabaseModel {

static getAll() {
  return this.query(
    "SELECT * FROM microblogs ORDER BY created_at DESC"
  );
}

static create({ title, content, createdBy }) {
  return this.query(
    `INSERT INTO microblogs (title, content, created_by)
     VALUES (?, ?, ?)`,
    [title, content, createdBy]
  );
}
}
