// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28 }}>Movie Store</h1>
      <p style={{ marginTop: 6 }}>Buy movies and get them delivered on Telegram.</p>
      <div style={{ marginTop: 20 }}>
        <Link href="/movies">
          <a style={{ display: "inline-block", padding: "10px 14px", background: "#0066ff", color: "white", borderRadius: 8, textDecoration: "none" }}>
            Browse Movies
          </a>
        </Link>
      </div>
    </main>
  );
}
