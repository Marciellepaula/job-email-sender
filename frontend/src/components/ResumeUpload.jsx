import { useState } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { api } from "../api";

export default function ResumeUpload({ uploaded, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Apenas arquivos PDF são permitidos");
      return;
    }
    setError("");
    setUploading(true);
    try {
      await api.uploadResume(file);
      onUploaded?.();
    } catch (err) {
      setError(err.response?.data?.error || "Falha no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card">
      <h2>
        <Upload size={20} /> Currículo
      </h2>
      <div className="resume-area">
        {uploaded ? (
          <div className="resume-ok">
            <CheckCircle size={20} />
            <span>Currículo enviado</span>
          </div>
        ) : (
          <div className="resume-warn">
            <AlertCircle size={20} />
            <span>Nenhum currículo enviado</span>
          </div>
        )}
        <label className="btn btn-secondary upload-btn">
          {uploading ? "Enviando..." : "Enviar PDF"}
          <input type="file" accept=".pdf" onChange={handleFile} hidden disabled={uploading} />
        </label>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
