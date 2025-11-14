import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const usersFile = path.join(process.cwd(), "data/users.json");

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // read users from JSON
        const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
        const user = users.find(u => u.username === credentials.username);
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user.id, name: user.username };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "supersecretkey",
});
