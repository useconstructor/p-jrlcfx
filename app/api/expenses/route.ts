import { db } from "@/lib/db";

export async function GET() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'MXN',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const { rows } = await db.execute("SELECT * FROM expenses ORDER BY created_at DESC");
  return Response.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'MXN',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  await db.execute({
    sql: "INSERT INTO expenses (description, amount, currency) VALUES (?, ?, ?)",
    args: [body.description, body.amount, body.currency ?? "MXN"],
  });

  return Response.json({ ok: true });
}
