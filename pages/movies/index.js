// pages/movies/index.js
import movies from "../../data/movies";
import Link from "next/link";

export default function MoviesPage() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24 }}>Available Movies</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginTop: 16 }}>
        {movies.map(m => (
          <div key={m.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
            <img src={m.poster} alt={m.title} style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: 6 }} />
            <h3 style={{ marginTop: 8 }}>{m.title}</h3>
            <p>KES {m.price}</p>
            <Link href={`/movies/${m.id}`}>
              <a style={{ display: "inline-block", marginTop: 8, padding: "8px 12px", background: "#0a84ff", color: "white", borderRadius: 6, textDecoration: "none" }}>
                View / Buy
              </a>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
