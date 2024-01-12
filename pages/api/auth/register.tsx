// pages/api/auth/register.tsx
import { hash } from "bcrypt";
import { sql } from "@vercel/postgres";

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "POST") {
      const data = JSON.parse(req.body);
      // Now you can use the 'data' object for further processing
      // ...
      const hashedPassword = await hash(data.password, 10);

      const response = await sql`
        INSERT INTO users (email, password)
        VALUES (${data.email}, ${hashedPassword})
        `;

      console.log(data);
    }
  } catch (e) {
    console.error("Error processing registration:", e);
    return {
      status: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
}
