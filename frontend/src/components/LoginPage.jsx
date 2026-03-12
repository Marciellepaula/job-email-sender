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
      setError(err.response?.data?.message || "Algo deu errado");
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
          <p>{isRegister ? "Crie sua conta" : "Entre para continuar"}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="login-field">
              <User size={18} />
              <input
                type="text"
                placeholder="Nome"
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
              placeholder="Senha"
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
              "Carregando..."
            ) : isRegister ? (
              <>
                <UserPlus size={18} /> Criar Conta
              </>
            ) : (
              <>
                <LogIn size={18} /> Entrar
              </>
            )}
          </button>
        </form>

        <div className="login-toggle">
          {isRegister ? (
            <span>
              Já tem uma conta?{" "}
              <button type="button" onClick={() => { setIsRegister(false); setError(""); }}>
                Entrar
              </button>
            </span>
          ) : (
            <span>
              Não tem uma conta?{" "}
              <button type="button" onClick={() => { setIsRegister(true); setError(""); }}>
                Registrar
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
