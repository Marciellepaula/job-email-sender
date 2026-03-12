import { useState } from "react";
import { Plus, Trash2, Building2, User, Mail } from "lucide-react";
import { api } from "../api";

export default function ContactList({ contacts, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ companyName: "", email: "", recruiterName: "" });
  const [error, setError] = useState("");

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.companyName.trim() || !form.email.trim()) {
      setError("Company name and email are required");
      return;
    }
    setError("");
    try {
      await api.addContact(form);
      setForm({ companyName: "", email: "", recruiterName: "" });
      setShowForm(false);
      onRefresh?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add contact");
    }
  }

  async function handleDelete(id) {
    await api.deleteContact(id);
    onRefresh?.();
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <Building2 size={20} /> Contacts ({contacts.length})
        </h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Add
        </button>
      </div>

      {showForm && (
        <form className="add-form" onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-group">
              <label>Company *</label>
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
                placeholder="rh@company.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Recruiter</label>
              <input
                placeholder="Ana (optional)"
                value={form.recruiterName}
                onChange={(e) => setField("recruiterName", e.target.value)}
              />
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Contact
            </button>
          </div>
        </form>
      )}

      {contacts.length === 0 ? (
        <p className="empty">No contacts yet. Add your first contact above.</p>
      ) : (
        <div className="contact-table">
          <div className="table-head">
            <span>Company</span>
            <span>Email</span>
            <span>Recruiter</span>
            <span></span>
          </div>
          {contacts.map((c) => (
            <div key={c.id} className="table-row">
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
                aria-label="Delete"
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
