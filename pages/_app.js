import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <nav className="p-4 bg-gray-800 text-white flex justify-between">
        <a href="/">Home</a>
        <div className="space-x-4">
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
        </div>
      </nav>
      <Component {...pageProps} />
    </>
  )
}
