export default async function handler(req: any, res: any) {
  try {
    if (req.method === "POST") {
      console.log("testing")
      // Extract email and password from the request body
      const { email, password } = req.body;

      console.log(email);
      console.log(password);

      // Return a message without actual authentication
      return res.status(200).json({ message: "Authenticated User" });
    }

    // Return a 404 for any other HTTP method
    return res.status(404).json({ message: "Not Found" });
  } catch (error) {
    console.error("Error processing login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
