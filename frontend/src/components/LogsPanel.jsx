import { useState, useEffect } from "react";
import {
  FileText, Trash2, CheckCircle, XCircle, SkipForward,
  RefreshCw, Mail, Building2, Clock, Search, Paperclip, Wifi, User,
  Eye, MousePointer, AlertTriangle, Send
} from "lucide-react";
import { api } from "../api";

export default function LogsPanel() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await api.getLogs();
      setLogs(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    if (!confirm("Tem certeza que deseja limpar TODO o histórico? Essa ação não pode ser desfeita.")) return;
    await api.clearLogs();
    setLogs([]);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter((entry) => {
    if (filter !== "all" && entry.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        entry.email?.toLowerCase().includes(q) ||
        entry.companyName?.toLowerCase().includes(q) ||
        entry.provider?.toLowerCase().includes(q) ||
        entry.subject?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].reverse();

  const stats = {
    total: logs.length,
    sent: logs.filter((l) => l.status === "sent").length,
    failed: logs.filter((l) => l.status === "failed").length,
    skipped: logs.filter((l) => l.status === "skipped").length,
  };

  const statusIcon = (status) => {
    if (status === "sent") return <CheckCircle size={15} />;
    if (status === "failed") return <XCircle size={15} />;
    return <SkipForward size={15} />;
  };

  const statusLabel = (status) => {
    if (status === "sent") return "Enviado";
    if (status === "failed") return "Falhou";
    return "Pulado";
  };

  return (
    <div className="card history-panel">
      <div className="card-header">
        <h2>
          <FileText size={20} /> Histórico de Envios
          {logs.length > 0 && <span className="history-count">({logs.length})</span>}
        </h2>
      </div>

      <div className="history-content">
        {/* Stats */}
        <div className="history-stats">
          <div
            className={`stat-card ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div
            className={`stat-card stat-sent ${filter === "sent" ? "active" : ""}`}
            onClick={() => setFilter("sent")}
          >
            <CheckCircle size={16} />
            <span className="stat-number">{stats.sent}</span>
            <span className="stat-label">Enviados</span>
          </div>
          <div
            className={`stat-card stat-failed ${filter === "failed" ? "active" : ""}`}
            onClick={() => setFilter("failed")}
          >
            <XCircle size={16} />
            <span className="stat-number">{stats.failed}</span>
            <span className="stat-label">Falharam</span>
          </div>
          <div
            className={`stat-card stat-skipped ${filter === "skipped" ? "active" : ""}`}
            onClick={() => setFilter("skipped")}
          >
            <SkipForward size={16} />
            <span className="stat-number">{stats.skipped}</span>
            <span className="stat-label">Pulados</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="history-toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar por email, empresa, provedor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="toolbar-actions">
            <button className="btn btn-ghost btn-sm" onClick={loadLogs} disabled={loading}>
              <RefreshCw size={14} className={loading ? "spin" : ""} /> Atualizar
            </button>
            {logs.length > 0 && (
              <button className="btn btn-danger btn-sm" onClick={handleClear}>
                <Trash2 size={14} /> Limpar Tudo
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {sorted.length === 0 ? (
          <p className="empty">
            {logs.length === 0
              ? "Nenhum email registrado ainda. Envie emails e eles aparecerão aqui."
              : "Nenhum resultado para o filtro atual."}
          </p>
        ) : (
          <div className="history-table">
            <div className="history-head">
              <span>Status</span>
              <span>Destinatário</span>
              <span>Empresa</span>
              <span>Rastreio</span>
              <span>Data/Hora</span>
            </div>
            {sorted.map((entry) => (
              <div key={entry.id}>
                <div
                  className={`history-row ${entry.status}`}
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  style={{ cursor: "pointer" }}
                >
                  <span className={`history-status badge-${entry.status}`}>
                    {statusIcon(entry.status)}
                    {statusLabel(entry.status)}
                  </span>
                  <span className="history-email">
                    <Mail size={13} />
                    {entry.email}
                  </span>
                  <span className="history-company">
                    <Building2 size={13} />
                    {entry.companyName}
                  </span>
                  <span className="tracking-icons">
                    <span className={`track-icon ${entry.deliveredAt ? "active" : ""}`} title={entry.deliveredAt ? `Entregue: ${new Date(entry.deliveredAt).toLocaleString("pt-BR")}` : "Não entregue"}>
                      <Send size={13} />
                    </span>
                    <span className={`track-icon ${entry.openedAt ? "active opened" : ""}`} title={entry.openedAt ? `Aberto: ${new Date(entry.openedAt).toLocaleString("pt-BR")} (${entry.openCount || 1}x)` : "Não aberto"}>
                      <Eye size={13} />
                      {entry.openCount > 1 && <small>{entry.openCount}</small>}
                    </span>
                    <span className={`track-icon ${entry.clickedAt ? "active clicked" : ""}`} title={entry.clickedAt ? `Clicado: ${new Date(entry.clickedAt).toLocaleString("pt-BR")}` : "Não clicado"}>
                      <MousePointer size={13} />
                    </span>
                    {entry.bouncedAt && (
                      <span className="track-icon bounced" title={`Bounce: ${new Date(entry.bouncedAt).toLocaleString("pt-BR")}`}>
                        <AlertTriangle size={13} />
                      </span>
                    )}
                  </span>
                  <span className="history-time">
                    <Clock size={13} />
                    {new Date(entry.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>

                {expandedId === entry.id && (
                  <div className="history-detail-panel">
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label"><Mail size={12} /> Email</span>
                        <span className="detail-value">{entry.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label"><Building2 size={12} /> Empresa</span>
                        <span className="detail-value">{entry.companyName}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label"><User size={12} /> Recrutador</span>
                        <span className="detail-value">{entry.recruiterName || "—"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label"><Wifi size={12} /> Provedor</span>
                        <span className="detail-value">{entry.provider || "—"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label"><FileText size={12} /> Assunto</span>
                        <span className="detail-value">{entry.subject || "—"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label"><Paperclip size={12} /> Anexo</span>
                        <span className="detail-value">
                          {entry.hasAttachment ? (
                            <span className="detail-ok">Sim (CV anexado)</span>
                          ) : (
                            <span className="text-muted">Não</span>
                          )}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label"><Clock size={12} /> Enviado em</span>
                        <span className="detail-value">{new Date(entry.createdAt).toLocaleString("pt-BR")}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status</span>
                        <span className={`detail-value badge-${entry.status}`}>
                          {statusIcon(entry.status)} {statusLabel(entry.status)}
                        </span>
                      </div>
                    </div>

                    {/* Tracking timeline */}
                    {entry.status === "sent" && (
                      <div className="tracking-timeline">
                        <h4>Rastreamento</h4>
                        <div className="timeline-items">
                          <div className={`timeline-item ${entry.deliveredAt ? "done" : "pending"}`}>
                            <Send size={14} />
                            <span>Entregue</span>
                            <span className="timeline-date">
                              {entry.deliveredAt ? new Date(entry.deliveredAt).toLocaleString("pt-BR") : "Aguardando..."}
                            </span>
                          </div>
                          <div className={`timeline-item ${entry.openedAt ? "done" : "pending"}`}>
                            <Eye size={14} />
                            <span>Aberto {entry.openCount > 0 ? `(${entry.openCount}x)` : ""}</span>
                            <span className="timeline-date">
                              {entry.openedAt ? new Date(entry.openedAt).toLocaleString("pt-BR") : "Aguardando..."}
                            </span>
                          </div>
                          <div className={`timeline-item ${entry.clickedAt ? "done" : "pending"}`}>
                            <MousePointer size={14} />
                            <span>Clicado</span>
                            <span className="timeline-date">
                              {entry.clickedAt ? new Date(entry.clickedAt).toLocaleString("pt-BR") : "—"}
                            </span>
                          </div>
                          {entry.bouncedAt && (
                            <div className="timeline-item bounced">
                              <AlertTriangle size={14} />
                              <span>Bounce</span>
                              <span className="timeline-date">{new Date(entry.bouncedAt).toLocaleString("pt-BR")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {entry.error && (
                      <div className="detail-error-box">
                        <strong>Erro:</strong> {entry.error}
                      </div>
                    )}
                    {entry.reason && (
                      <div className="detail-reason-box">
                        <strong>Motivo:</strong> {entry.reason}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {sorted.length > 0 && (
          <div className="history-footer">
            Mostrando {sorted.length} de {logs.length} registro(s)
            {filter !== "all" && ` — filtro: ${statusLabel(filter)}`}
          </div>
        )}
      </div>
    </div>
  );
}
