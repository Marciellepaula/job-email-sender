import { useState } from "react";
import { Plus, Trash2, Building2, User, Mail, CheckSquare, Square } from "lucide-react";
import { api } from "../api";

export default function ContactList({ contacts, onRefresh, selectedIds, onSelectionChange }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ companyName: "", email: "", recruiterName: "" });
  const [error, setError] = useState("");

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSelect(id) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  }

  function toggleAll() {
    if (selectedIds.size === contacts.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(contacts.map((c) => c.id)));
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.companyName.trim() || !form.email.trim()) {
      setError("Nome da empresa e email são obrigatórios");
      return;
    }
    setError("");
    try {
      const newContact = await api.addContact(form);
      setForm({ companyName: "", email: "", recruiterName: "" });
      setShowForm(false);
      onRefresh?.();
      if (newContact?.id) {
        const next = new Set(selectedIds);
        next.add(newContact.id);
        onSelectionChange(next);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao adicionar contato");
    }
  }

  async function handleDelete(id) {
    await api.deleteContact(id);
    const next = new Set(selectedIds);
    next.delete(id);
    onSelectionChange(next);
    onRefresh?.();
  }

  const allSelected = contacts.length > 0 && selectedIds.size === contacts.length;

  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <Building2 size={20} /> Contatos ({contacts.length})
          {selectedIds.size > 0 && selectedIds.size < contacts.length && (
            <span className="selection-count"> — {selectedIds.size} selecionado(s)</span>
          )}
        </h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Adicionar
        </button>
      </div>

      {showForm && (
        <form className="add-form" onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-group">
              <label>Empresa *</label>
              <input
                placeholder="TechCorp Brasil"
                value={form.companyName}
                onChange={(e) => setField("companyName", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                placeholder="rh@empresa.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Recrutador</label>
              <input
                placeholder="Ana (opcional)"
                value={form.recruiterName}
                onChange={(e) => setField("recruiterName", e.target.value)}
              />
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Salvar Contato
            </button>
          </div>
        </form>
      )}

      {contacts.length === 0 ? (
        <p className="empty">Nenhum contato ainda. Adicione seu primeiro contato acima.</p>
      ) : (
        <div className="contact-table">
          <div className="table-head">
            <span className="cell-check" onClick={toggleAll} style={{ cursor: "pointer" }}>
              {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
            </span>
            <span>Empresa</span>
            <span>Email</span>
            <span>Recrutador</span>
            <span></span>
          </div>
          {contacts.map((c) => (
            <div key={c.id} className={`table-row ${selectedIds.has(c.id) ? "selected" : ""}`}>
              <span className="cell-check" onClick={() => toggleSelect(c.id)} style={{ cursor: "pointer" }}>
                {selectedIds.has(c.id) ? <CheckSquare size={16} className="check-on" /> : <Square size={16} />}
              </span>
              <span className="cell-company">
                <Building2 size={14} /> {c.companyName}
              </span>
              <span className="cell-email">
                <Mail size={14} /> {c.email}
              </span>
              <span className="cell-recruiter">
                <User size={14} /> {c.recruiterName || "\u2014"}
              </span>
              <button
                className="btn-icon danger"
                onClick={() => handleDelete(c.id)}
                aria-label="Excluir"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
