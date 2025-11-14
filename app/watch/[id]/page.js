import { getSession } from "next-auth/react";
import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "data/users.json");

export default async function Watch({ params, req }) {
  const session = await getSession({ req });

  if (!session) return <div>Please login to watch this movie.</div>;

  const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
  const user = users.find(u => u.username === session.user.name);

  const movieId = params.id;
  const now = new Date();

  // Check per-movie expiration
  if (user.moviesWatched[movieId]) {
    const expiry = new Date(user.moviesWatched[movieId]);
    if (expiry > now) {
      return (
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Continue Watching Movie #{movieId}</h1>
          <video className="w-full h-[70vh] object-cover rounded-xl" controls src={`/videos/movie${movieId}.mp4`} />
        </div>
      );
    }
  }

  // If not watched or expired, set new 30-day access
  user.moviesWatched[movieId] = new Date(now.getTime() + 30*24*60*60*1000).toISOString();
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Watching Movie #{movieId}</h1>
      <video className="w-full h-[70vh] object-cover rounded-xl" controls src={`/videos/movie${movieId}.mp4`} />
    </div>
  );
}
