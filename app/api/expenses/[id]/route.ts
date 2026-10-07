import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const fields = Object.keys(body)
    .map((k) => `${k}=?`)
    .join(", ");
  await db.execute({
    sql: `UPDATE expenses SET ${fields} WHERE id=?`,
    args: [...Object.values(body), id],
  });

  const { rows } = await db.execute({
    sql: "SELECT * FROM expenses WHERE id=?",
    args: [id],
  });

  return Response.json(rows[0] ?? null);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.execute({ sql: "DELETE FROM expenses WHERE id=?", args: [id] });
  return Response.json({ ok: true });
}
