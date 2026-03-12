import { useState, useEffect, useRef } from "react";
import { Send, Loader2, CheckCircle, XCircle, SkipForward, FileText, Building2 } from "lucide-react";
import { api } from "../api";

const DEFAULT_SENDER_NAME = "Marcielle Paula";
const DEFAULT_SUBJECT = "Candidatura para Vaga de Desenvolvedor(a) de Software — {company}";
const DEFAULT_MESSAGE = `Olá {recruiter},

Meu nome é Marcielle Paula e sou desenvolvedora de software com experiência em Node.js, React, Laravel e desenvolvimento de APIs.

Tenho muito interesse em oportunidades na {company}. Segue meu currículo em anexo para sua apreciação.

Agradeço pela atenção e fico no aguardo de um retorno.

Atenciosamente,
Marcielle Paula`;

export default function SendPanel({ contacts, selectedIds, resumeUploaded }) {
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState([]);
  const [senderName, setSenderName] = useState(() => localStorage.getItem("senderName") || DEFAULT_SENDER_NAME);
  const [subject, setSubject] = useState(() => localStorage.getItem("emailSubject") || DEFAULT_SUBJECT);
  const [message, setMessage] = useState(() => localStorage.getItem("emailMessage") || DEFAULT_MESSAGE);
  const [showTemplate, setShowTemplate] = useState(false);
  const pollRef = useRef(null);

  const sendCount = selectedIds.size > 0 ? selectedIds.size : contacts.length;
  const canSend = sendCount > 0 && resumeUploaded;

  useEffect(() => {
    localStorage.setItem("senderName", senderName);
  }, [senderName]);

  useEffect(() => {
    localStorage.setItem("emailSubject", subject);
  }, [subject]);

  useEffect(() => {
    localStorage.setItem("emailMessage", message);
  }, [message]);

  async function handleSend() {
    if (!canSend || sending) return;
    setSending(true);
    setResults([]);
    try {
      const contactIds = selectedIds.size > 0 ? [...selectedIds] : null;
      await api.sendEmails({ senderName, subject, message, contactIds });
      pollRef.current = setInterval(pollStatus, 2000);
    } catch (err) {
      setSending(false);
      setResults([{ status: "failed", email: "sistema", error: err.response?.data?.message || err.message }]);
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

  function handleReset() {
    setSenderName(DEFAULT_SENDER_NAME);
    setSubject(DEFAULT_SUBJECT);
    setMessage(DEFAULT_MESSAGE);
  }

  const sent = results.filter((r) => r.status === "sent").length;
  const failed = results.filter((r) => r.status === "failed").length;
  const skipped = results.filter((r) => r.status === "skipped").length;

  const buttonLabel = selectedIds.size > 0
    ? `Enviar para Selecionados (${selectedIds.size})`
    : `Enviar para Todos (${contacts.length})`;

  return (
    <div className="card send-panel">
      <div className="card-header">
        <h2>
          <Send size={20} /> Enviar Emails
        </h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowTemplate(!showTemplate)}
            title="Editar template do email"
          >
            <FileText size={18} /> {showTemplate ? "Ocultar" : "Template"}
          </button>
          <button className="btn btn-primary" onClick={handleSend} disabled={!canSend || sending}>
            {sending ? (
              <>
                <Loader2 size={18} className="spin" /> Enviando...
              </>
            ) : (
              <>
                <Send size={18} /> {buttonLabel}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="sender-name-bar">
        <label htmlFor="sender-name"><Building2 size={15} /> Remetente:</label>
        <input
          id="sender-name"
          type="text"
          className="sender-name-input"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="Nome ou empresa remetente..."
        />
        <small className="sender-preview">Aparece como: <strong>{senderName || "?"}</strong> &lt;marcielle0644@gmail.com&gt;</small>
      </div>

      {showTemplate && (
        <div className="template-editor">
          <div className="form-group">
            <label htmlFor="email-subject">Assunto</label>
            <input
              id="email-subject"
              type="text"
              className="form-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto do email..."
            />
            <small className="hint-text">Use <code>{"{company}"}</code> para o nome da empresa</small>
          </div>
          <div className="form-group">
            <label htmlFor="email-message">Mensagem</label>
            <textarea
              id="email-message"
              className="form-input"
              rows={10}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Corpo do email..."
            />
            <small className="hint-text">
              Use <code>{"{company}"}</code> para nome da empresa e <code>{"{recruiter}"}</code> para nome do recrutador
            </small>
          </div>
          <button className="btn btn-secondary" onClick={handleReset} style={{ fontSize: "12px" }}>
            Restaurar padrão
          </button>
        </div>
      )}

      {!canSend && !sending && (
        <p className="warn-text">
          {!resumeUploaded && "Envie seu currículo primeiro. "}
          {contacts.length === 0 && "Adicione pelo menos um contato."}
        </p>
      )}

      {results.length > 0 && (
        <>
          <div className="send-summary">
            <span className="badge-sent">{sent} enviado(s)</span>
            <span className="badge-failed">{failed} falhou</span>
            <span className="badge-skipped">{skipped} pulado(s)</span>
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
