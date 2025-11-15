// pages/auth/signup.js
import { useState } from "react";
import Router from "next/router";

export default function Signup() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function validatePassword(p) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(p);
  }

  async function handleSignup(e) {
    e.preventDefault();
    setErr("");
    if (!phone) return setErr("Enter phone");
    if (!validatePassword(password)) return setErr("Password must be 8+ chars, include upper, lower, number and special char");
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone, password })
    });
    const j = await res.json();
    setLoading(false);
    if (!res.ok) return setErr(j.error || "Signup failed");
    localStorage.setItem("token", j.token);
    Router.push("/movies");
  }

  return (
    <div style={{padding:20}}>
      <h1>Create account</h1>
      <form onSubmit={handleSignup} style={{maxWidth:420}}>
        <label>Phone (07...)</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07XXXXXXXX" style={{width:"100%", padding:8}} />
        <label style={{marginTop:8}}>Password</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Strong password" style={{width:"100%", padding:8}} />
        <div style={{fontSize:13, color:"#888", marginTop:6}}>
          Password must be 8+ characters, include uppercase, lowercase, number and special character.
        </div>
        {err && <div style={{color:"red", marginTop:8}}>{err}</div>}
        <button disabled={loading} style={{marginTop:12, padding:10}}>{loading ? "Creating..." : "Create account"}</button>
      </form>
    </div>
  );
}
