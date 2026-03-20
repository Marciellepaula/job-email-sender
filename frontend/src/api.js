import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
  : "/api";

const http = axios.create({
  baseURL,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes("/auth/")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

function unwrap(promise) {
  return promise.then((r) => r.data?.data ?? r.data);
}

export const api = {
  login: (data) => unwrap(http.post("/auth/login", data)),
  register: (data) => unwrap(http.post("/auth/register", data)),
  me: () => unwrap(http.get("/auth/me")),

  getHealth: () => unwrap(http.get("/health")),
  getContacts: () => unwrap(http.get("/contacts")),
  addContact: (data) => unwrap(http.post("/contacts", data)),
  updateContact: (id, data) => unwrap(http.put(`/contacts/${id}`, data)),
  deleteContact: (id) => unwrap(http.delete(`/contacts/${id}`)),

  uploadResume: (file) => {
    const fd = new FormData();
    fd.append("resume", file);
    return unwrap(http.post("/resume/upload", fd));
  },
  getResumeStatus: () => unwrap(http.get("/resume/status")),

  sendEmails: (data) => unwrap(http.post("/emails/send", data)),
  getSendStatus: () =>
    unwrap(http.get("/emails/status", { params: { _: Date.now() } })),
  getLogs: () => unwrap(http.get("/emails/logs")),
  clearLogs: () => unwrap(http.delete("/emails/logs")),
};
