import { useState, useEffect, useCallback } from "react";
import { Mail, LogOut } from "lucide-react";
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
  const [contacts, setContacts] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const [h, c] = await Promise.all([api.getHealth(), api.getContacts()]);
      setHealth(h);
      setContacts(c);
    } catch {
      /* server might not be ready */
    }
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setHealth(null);
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
        <p className="header-sub">Automated application emails with resume attachment</p>
        <div className="header-user">
          <span>{user.name || user.email}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="main">
        <StatusBar health={health} />
        <ResumeUpload uploaded={health?.resumeUploaded} onUploaded={refresh} />
        <ContactList contacts={contacts} onRefresh={refresh} />
        <SendPanel contactsCount={contacts.length} resumeUploaded={health?.resumeUploaded} />
        <LogsPanel />
      </main>
    </div>
  );
}
