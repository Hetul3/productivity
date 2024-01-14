// pages/api/auth/register.tsx
import { hash, compare } from "bcrypt";
import { sql } from "@vercel/postgres";

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "POST") {
      const data = JSON.parse(req.body);
      const hashedPassword = await hash(data.password, 10);

      const response = await sql`
        INSERT INTO users (email, password)
        VALUES (${data.email}, ${hashedPassword})
        `;

      console.log(data);
      res.status(200).json({message: "Registered"});
    }
    else if(req.method === "GET") {
      const data = JSON.parse(req.body);
      if(!data.email || !data.password) {
        return res.status(400).json({message: "Email and password are undefined"});
      }

      const userResult = await sql`
        SELECT * FROM users
        WHERE email = ${data.email}
        LIMIT 1
      `;

      const userRows = userResult.rows;

      if(!userRows || userRows.length === 0) {
        return res.status(401).json({message: "Invalid credientials"});
      }

      const user = userRows[0];

      const passwordMatch = await compare(data.password, user.password);

      if(!passwordMatch) {
        return res.status(401).json({message: "Invalid credientials again"});
      }

      console.log("User authenticated: ", user.email);
      return res.status(200).json({message: "Authentication Successful"});
    }
  } catch (e) {
    console.error("Error processing registration:", e);
    return {
      status: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
}
