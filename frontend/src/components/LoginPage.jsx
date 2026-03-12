import { useState } from "react";
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { api } from "../api";

export default function LoginPage({ onAuth }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = isRegister
        ? await api.register(form)
        : await api.login({ email: form.email, password: form.password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onAuth(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <Mail size={36} className="login-icon" />
          <h1>Job Email Sender</h1>
          <p>{isRegister ? "Create your account" : "Sign in to continue"}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="login-field">
              <User size={18} />
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                required
              />
            </div>
          )}

          <div className="login-field">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? (
              "Loading..."
            ) : isRegister ? (
              <>
                <UserPlus size={18} /> Create Account
              </>
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-toggle">
          {isRegister ? (
            <span>
              Already have an account?{" "}
              <button type="button" onClick={() => { setIsRegister(false); setError(""); }}>
                Sign in
              </button>
            </span>
          ) : (
            <span>
              Don&apos;t have an account?{" "}
              <button type="button" onClick={() => { setIsRegister(true); setError(""); }}>
                Register
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
