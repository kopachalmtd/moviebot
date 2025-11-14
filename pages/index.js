import { useState } from "react";

const movies = [
  {
    id: "m1",
    title: "Movie One",
    price: 100,
    poster: "/poster1.jpg",
    tg_file_id: "FILE_ID_1"
  },
  {
    id: "m2",
    title: "Movie Two",
    price: 150,
    poster: "/poster2.jpg",
    tg_file_id: "FILE_ID_2"
  },
  {
    id: "m3",
    title: "Movie Three",
    price: 200,
    poster: "/poster3.jpg",
    tg_file_id: "FILE_ID_3"
  }
];

export default function Home() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function buy(movie) {
    if (!phone) return alert("Enter phone number 07XXXXXXXX");

    setLoading(true);

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

    const data = await resp.json();
    setLoading(false);

    if (data.ok) {
      alert("STK Push sent! Check your phone.");
    } else {
      alert("Error: " + data.error);
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Movie Store</h1>
      <input
        placeholder="07XXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ padding: 10, marginBottom: 20 }}
      />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 20
      }}>
        {movies.map(movie => (
          <div key={movie.id} style={{
            border: "1px solid #ddd",
            padding: 10,
            borderRadius: 10
          }}>
            <img
              src={movie.poster}
              alt={movie.title}
              style={{ width: "100%", borderRadius: 10 }}
            />
            <h3>{movie.title}</h3>
            <p>KES {movie.price}</p>
            <button
              onClick={() => buy(movie)}
              disabled={loading}
              style={{ padding: 10 }}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
