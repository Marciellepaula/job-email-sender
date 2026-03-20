import { useState, useEffect, useCallback } from "react";
import { Mail, LogOut, Send, FileText } from "lucide-react";
import { api } from "./api";
import LoginPage from "./components/LoginPage";
import StatusBar from "./components/StatusBar";
import ResumeUpload from "./components/ResumeUpload";
import ContactList from "./components/ContactList";
import SendPanel from "./components/SendPanel";
import LogsPanel from "./components/LogsPanel";

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (raw && token) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

export default function App() {
  const [user, setUser] = useState(getStoredUser);
  const [health, setHealth] = useState(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState("send");

  const refresh = useCallback(async () => {
    api.getContacts()
      .then((data) => setContacts(Array.isArray(data) ? data : []))
      .catch(() => {});

    api.getHealth()
      .then((data) => setHealth(data))
      .catch(() => {});

    api.getResumeStatus()
      .then((data) => setResumeUploaded(!!data?.uploaded))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setHealth(null);
    setResumeUploaded(false);
    setContacts([]);
  }

  if (!user) {
    return <LoginPage onAuth={setUser} />;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <Mail size={28} />
          <h1>Job Email Sender</h1>
        </div>
        <p className="header-sub">Envio automático de emails de candidatura com currículo</p>
        <div className="header-user">
          <span>{user.name || user.email}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            <LogOut size={16} /> Sair
          </button>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${page === "send" ? "active" : ""}`}
            onClick={() => setPage("send")}
          >
            <Send size={16} /> Enviar
          </button>
          <button
            className={`nav-tab ${page === "history" ? "active" : ""}`}
            onClick={() => setPage("history")}
          >
            <FileText size={16} /> Histórico
          </button>
        </nav>
      </header>

      {page === "send" && (
        <main className="main">
          <StatusBar health={health} resumeUploaded={resumeUploaded} />
          <ResumeUpload uploaded={resumeUploaded} onUploaded={refresh} />
          <ContactList
            contacts={contacts}
            onRefresh={refresh}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
          <SendPanel
            contacts={contacts}
            selectedIds={selectedIds}
            resumeUploaded={resumeUploaded}
          />
        </main>
      )}

      {page === "history" && (
        <main className="main">
          <LogsPanel />
        </main>
      )}
    </div>
  );
}
