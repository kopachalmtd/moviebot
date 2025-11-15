// pages/api/auth/me.js
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const auth = req.headers.authorization || "";
  const token = auth.replace("Bearer ", "") || req.body?.token || null;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { db } = await connectToDatabase();
    const users = db.collection("users");
    const user = await users.findOne({ _id: new ObjectId(decoded.sub) }, { projection: { password: 0 } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ ok: true, user });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
