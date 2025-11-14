import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const usersFile = path.join(process.cwd(), "data/users.json");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    const users = fs.existsSync(usersFile)
      ? JSON.parse(fs.readFileSync(usersFile, "utf8"))
      : [];

    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password: bcrypt.hashSync(password, 10),
      subscriptionEnd: null, // For subscription
      moviesWatched: {}     // For per-movie tracking
    };

    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    res.status(200).json({ message: "User created" });
  } else {
    res.status(405).end();
  }
}
