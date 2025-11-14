// pages/movies/[id].js
import { useRouter } from "next/router";
import movies from "../../data/movies";
import { useState } from "react";

export default function MoviePage() {
  const router = useRouter();
  const { id } = router.query;
  const movie = movies.find(m => m.id === id);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!movie) return <p style={{ padding: 24 }}>Loading...</p>;

  async function buyNow() {
    if (!phone) return alert("Enter phone number in format 07XXXXXXXX");
    setLoading(true);
    try {
      const resp = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          amount: movie.price,
          phone_number: phone,
          movie_id: movie.id,
          external_reference: `movie_${movie.id}_${Date.now()}`
        })
      });
      const j = await resp.json();
      setLoading(false);
      if (j.ok) {
        alert("STK Push sent. Check your phone. When payment succeeds the movie will be delivered on Telegram.");
      } else {
        alert("Error: " + (j.error || JSON.stringify(j)));
      }
    } catch (err) {
      setLoading(false);
      alert("Network error: " + err.message);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        <div>
          <img src={movie.poster} alt={movie.title} style={{ width: "100%", borderRadius: 8 }} />
          <h1 style={{ marginTop: 12 }}>{movie.title}</h1>
          <p>Price: KES {movie.price}</p>
        </div>

        <aside style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
          <h3>Buy & Deliver</h3>
          <p>Enter phone number to receive STK Push (M-Pesa)</p>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="07XXXXXXXX" style={{ width: "100%", padding: 10, marginTop: 8 }} />
          <button onClick={buyNow} disabled={loading} style={{ width: "100%", padding: 10, marginTop: 12, background: "#0a84ff", color: "white", border: "none", borderRadius: 6 }}>
            {loading ? "Sending..." : `Pay KES ${movie.price}`}
          </button>
        </aside>
      </div>
    </main>
  );
}
