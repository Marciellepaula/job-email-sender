import { useState, useEffect } from "react";
import { FileText, Trash2, CheckCircle, XCircle, SkipForward } from "lucide-react";
import { api } from "../api";

export default function LogsPanel() {
  const [logs, setLogs] = useState([]);
  const [show, setShow] = useState(false);

  async function loadLogs() {
    const data = await api.getLogs();
    setLogs(Array.isArray(data) ? data : []);
  }

  async function handleClear() {
    await api.clearLogs();
    setLogs([]);
  }

  useEffect(() => {
    if (show) loadLogs();
  }, [show]);

  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <FileText size={20} /> Sent History ({logs.length})
        </h2>
        <div className="header-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"}
          </button>
          {logs.length > 0 && (
            <button className="btn btn-danger btn-sm" onClick={handleClear}>
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {show && logs.length === 0 && <p className="empty">No emails sent yet.</p>}

      {show && logs.length > 0 && (
        <div className="log-list">
          {[...logs].reverse().map((entry) => (
            <div key={entry.id} className={`log-row ${entry.status}`}>
              {entry.status === "sent" && <CheckCircle size={14} />}
              {entry.status === "failed" && <XCircle size={14} />}
              {entry.status === "skipped" && <SkipForward size={14} />}
              <span className="log-email">{entry.email}</span>
              <span className="log-company">{entry.companyName}</span>
              <span className="log-time">
                {new Date(entry.createdAt).toLocaleString("pt-BR")}
              </span>
              {entry.error && <span className="log-error">{entry.error}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
