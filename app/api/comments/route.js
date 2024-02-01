import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { useSession, getSession } from "next-auth/react";

const userSession = await getSession();
const userID = userSession?.user?.name;

export async function POST(req, res) {
  try {
    const userSession = await getSession();
    const userID = userSession?.user?.name;
    const commentData = await req.json();
    console.log({commentData});
    

    await sql`
      INSERT INTO commentslist (Id, Comment_text, User_name)
      VALUES (438902, ${commentText}, ${userID});
    `;
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req, res) {
  const session = await getSession({ req: req.next });
  const userName = session?.user?.name;

  try {
    const result =
      await sql`SELECT * FROM comments WHERE User_name = ${userName} ORDER BY Date_created DESC;`;
    const comments = result.rows;
    console.log(comments);
    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, res) {
  const commentId = await req.query.commentId;

  try {
    await sql`
      DELETE FROM comments
      WHERE Id = ${commentId} AND User_name = ${userID};
    `;
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, res) {
  const { userID, commentId, updateText } = await JSON.parse(req.body);

  try {
    await sql`
      UPDATE comments
      SET Comment_text = ${updateText}
      WHERE Id = ${commentId} AND User_name = ${userID};
    `;
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

