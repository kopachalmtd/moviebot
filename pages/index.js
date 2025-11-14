import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  const movies = [
    {
      id: 1,
      title: "Movie 1",
      poster: "/poster1.jpg",
    },
    {
      id: 2,
      title: "Movie 2",
      poster: "/poster2.jpg",
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.nav}>
        <h1 className={styles.logo}>MovieBox</h1>

        <Link href="/movies">
          <button className={styles.btnPrimary}>Browse Movies</button>
        </Link>
      </header>

      <section className={styles.hero}>
        <h2 className={styles.heroTitle}>Unlimited Movies</h2>
        <p className={styles.heroSubtitle}>Pay with M-Pesa and start watching instantly.</p>

        <Link href="/movies">
          <button className={styles.heroButton}>Start Watching</button>
        </Link>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Trending</h2>

        <div className={styles.grid}>
          {movies.map((m) => (
            <Link key={m.id} href={`/movies/${m.id}`}>
              <div className={styles.movieCard}>
                <img src={m.poster} className={styles.poster} />
                <div className={styles.movieTitle}>{m.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
