import { CheckCircle, XCircle, Upload, Users, Wifi } from "lucide-react";

export default function StatusBar({ health, resumeUploaded }) {
  if (!health) return null;

  const emailInfo = health.email || {};
  const providerLabel = emailInfo.providers?.length
    ? emailInfo.providers.join(" → ")
    : "Sem provedor";

  const resumeOk =
    typeof resumeUploaded === "boolean" ? resumeUploaded : !!health.resumeUploaded;

  const items = [
    {
      label: providerLabel,
      ok: emailInfo.ok,
      icon: <Wifi size={16} />
    },
    {
      label: "Currículo",
      ok: resumeOk,
      icon: <Upload size={16} />
    },
    {
      label: `${health.contactsCount} contato(s)`,
      ok: health.contactsCount > 0,
      icon: <Users size={16} />
    }
  ];

  return (
    <div className="status-bar">
      {items.map((item) => (
        <div key={item.label} className={`status-item ${item.ok ? "ok" : "warn"}`}>
          {item.icon}
          <span>{item.label}</span>
          {item.ok ? <CheckCircle size={14} /> : <XCircle size={14} />}
        </div>
      ))}
    </div>
  );
}
