import { sql } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function POST(req, res) {
  const { commentId, comment, now, userID } = JSON.parse(req.body);

  try {
    await sql`
      INSERT INTO Comments (Id, Comment_text, User_name, Date_created)
      VALUES (${commentId}, ${comment}, ${userID}, ${now});
    `;
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req, res) {
  const { userID } = req.body;

  try {
    const result = await sql`
      SELECT * FROM Comments WHERE User_name = ${userID};
    `;
    const comments = result.rows;

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, res) {
  const { userID, commentId } = JSON.parse(req.body);

  try {
    await sql`
      DELETE FROM Comments WHERE Id = ${commentId} AND User_name = ${userID};
    `;
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, res) {
  const { userID, commentId, updateText } = JSON.parse(req.body);

  try {
    await sql`
      UPDATE Comments
      SET Comment_text = ${updateText}
      WHERE Id = ${commentId} AND User_name = ${userID};
    `;
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


//enter what the rest of the endpoint should be to make it work

// export async function DELETE(req, res) {
//   const commentId = req.query.commentId;

//   try {
//     await sql`
//       DELETE FROM Comments
//       WHERE Id = ${commentId};
//     `;
//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function GET(req, res) {
//   const session = await getSession({ req: req.next });
//   const userName = session?.user?.name;

//   try {
//     const result =
//       await sql`SELECT * FROM Comments WHERE User_name = ${userName} ORDER BY Date_created DESC;`;
//     const comments = result.rows;
//     console.log(comments);
//     return NextResponse.json({ comments }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req, res) {
//   const { commentData } = JSON.parse(req.body);
//   const { comment, now, userID, commentId } = commentData;
//   const session = await getSession({req: req.next});
//   const userName = session?.user?.name;

//   try {
//     await sql`
//       INSERT INTO Comments (Id, Comment_text, User_name, Date_created)
//       VALUES (${commentId}, ${comment}, ${userName}, ${now});
//     `;
//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function PUT(req, res) {
//   const { text, date } = JSON.parse(req.body);
//   const commentId = req.query.commentId;

//   try {
//     await sql`
//       UPDATE Comments
//       SET Comment_text = ${text}, Date_created = ${date}
//       WHERE Id = ${commentId};
//     `;
//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

