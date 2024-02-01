import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const userName = searchParams.get("userName");

  try {
    if (!userName) throw new Error("Username required");

    // Insert user if it doesn't exist
    await sql`
        INSERT INTO Dbusers (Name) 
        VALUES (testing)
        ON CONFLICT (Name) DO NOTHING;
      `;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch all users
  const users = await sql`SELECT * FROM Dbusers;`;
  return NextResponse.json({ users }, { status: 200 });
}
