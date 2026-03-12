import { useState, useEffect, useRef } from "react";
import { Send, Loader2, CheckCircle, XCircle, SkipForward } from "lucide-react";
import { api } from "../api";

export default function SendPanel({ contactsCount, resumeUploaded }) {
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState([]);
  const pollRef = useRef(null);

  const canSend = contactsCount > 0 && resumeUploaded;

  async function handleSend() {
    if (!canSend || sending) return;
    setSending(true);
    setResults([]);
    try {
      await api.sendEmails();
      pollRef.current = setInterval(pollStatus, 2000);
    } catch (err) {
      setSending(false);
      setResults([{ status: "failed", email: "system", error: err.response?.data?.message || err.message }]);
    }
  }

  async function pollStatus() {
    try {
      const data = await api.getSendStatus();
      setResults(data?.results || []);
      if (!data?.inProgress && data?.results?.length > 0) {
        setSending(false);
        clearInterval(pollRef.current);
      }
    } catch {
      /* ignore polling errors */
    }
  }

  useEffect(() => {
    return () => clearInterval(pollRef.current);
  }, []);

  const sent = results.filter((r) => r.status === "sent").length;
  const failed = results.filter((r) => r.status === "failed").length;
  const skipped = results.filter((r) => r.status === "skipped").length;

  return (
    <div className="card send-panel">
      <div className="card-header">
        <h2>
          <Send size={20} /> Send Emails
        </h2>
        <button className="btn btn-primary" onClick={handleSend} disabled={!canSend || sending}>
          {sending ? (
            <>
              <Loader2 size={18} className="spin" /> Sending...
            </>
          ) : (
            <>
              <Send size={18} /> Send to All ({contactsCount})
            </>
          )}
        </button>
      </div>

      {!canSend && !sending && (
        <p className="warn-text">
          {!resumeUploaded && "Upload your resume first. "}
          {contactsCount === 0 && "Add at least one contact."}
        </p>
      )}

      {results.length > 0 && (
        <>
          <div className="send-summary">
            <span className="badge-sent">{sent} sent</span>
            <span className="badge-failed">{failed} failed</span>
            <span className="badge-skipped">{skipped} skipped</span>
          </div>
          <div className="results-list">
            {results.map((r, i) => (
              <div key={i} className={`result-row ${r.status}`}>
                {r.status === "sent" && <CheckCircle size={16} />}
                {r.status === "failed" && <XCircle size={16} />}
                {r.status === "skipped" && <SkipForward size={16} />}
                <span className="result-email">{r.email}</span>
                <span className="result-company">{r.companyName}</span>
                {r.error && <span className="result-error">{r.error}</span>}
                {r.reason && <span className="result-reason">{r.reason}</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
