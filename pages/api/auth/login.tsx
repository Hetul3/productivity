// pages/api/auth/login.tsx
import { compare } from "bcrypt";
import { sql } from "@vercel/postgres";

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "POST") {
      const { email, password } = req.query;
      console.log(email);
      console.log(password);
      return res.status(200).json({message: "Authenticated User"})
    }
  } catch (error) {
    //   try {
    //     if (req.method === "POST") {
    //       const { email, password } = req.query;

    //       if (!email || !password) {
    //         return res.status(400).json({ message: "Email and password are required" });
    //       }

    //       const userResult = await sql`
    //         SELECT * FROM users
    //         WHERE email = ${email}
    //         LIMIT 1
    //       `;

    //       const userRows = userResult.rows;

    //       if (!userRows || userRows.length === 0) {
    //         // User not found
    //         return res.status(401).json({ message: "Invalid credentials" });
    //       }

    //       const user = userRows[0];

    //       const passwordMatch = await compare(password, user.password);

    //       if (!passwordMatch) {
    //         // Password does not match
    //         return res.status(401).json({ message: "Invalid credentials" });
    //       }

    //       // User authenticated successfully
    //       // You can generate a token, set a session, or use NextAuth for authentication here
    //       // Example using NextAuth signIn:

    //       return res.status(200).json({ message: "Authentication successful" });
    //     }

    //     // Return a 404 for any other HTTP method
    //     return res.status(404).json({ message: "Not Found" });
    //   }
    console.error("Error processing login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
