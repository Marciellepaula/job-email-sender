import nodemailer from "nodemailer";
import Mailgun from "mailgun.js";
import FormData from "form-data";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { config } from "../config/index.js";

function parseFrom(fromValue) {
  if (!fromValue || typeof fromValue !== "string") return { name: "", email: "" };
  const m = fromValue.match(/^(.*)<([^>]+)>$/);
  if (m) return { name: m[1].trim().replace(/^"|"$/g, ""), email: m[2].trim() };
  return { name: "", email: fromValue.trim() };
}

// ─── Provider: SMTP (Gmail, Outlook, etc.) ──────────────

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    });
  }
  return transporter;
}

async function sendViaSMTP({ from, to, subject, text, html, attachments }) {
  const info = await getTransporter().sendMail({ from, to, subject, text, html, attachments });
  return { provider: "smtp", messageId: info.messageId };
}

async function verifySMTP() {
  await getTransporter().verify();
}

// ─── Provider: Mailgun ──────────────────────────────────

function getMailgunClient() {
  const mg = new Mailgun(FormData);
  return mg.client({ username: "api", key: config.mailgun.apiKey });
}

async function sendViaMailgun({ from, to, subject, text, html, attachments }) {
  const mg = getMailgunClient();
  const data = { from, to: [to], subject, text, html };

  if (attachments?.length) {
    data.attachment = attachments.map((a) => ({
      filename: a.filename,
      data: readFileSync(a.path),
    }));
  }

  const result = await mg.messages.create(config.mailgun.domain, data);
  return { provider: "mailgun", messageId: result.id || null };
}

// ─── Provider: Resend ───────────────────────────────────

let resendClient = null;

function getResendClient() {
  if (!resendClient) resendClient = new Resend(config.resend.apiKey);
  return resendClient;
}

async function sendViaResend({ from, to, subject, text, html, attachments }) {
  // O Resend exige que o domínio do email "from" esteja verificado.
  // Então a gente usa o email verificado do RESEND_FROM (config.resend.from)
  // e mantém apenas o NOME customizado que vem em `from`.
  const customFrom = parseFrom(from);
  const resendFrom = parseFrom(config.resend.from);

  const senderEmail = resendFrom.email || config.resend.from;
  const senderName = customFrom.name || resendFrom.name;
  const sender = senderEmail && senderName ? `${senderName} <${senderEmail}>` : config.resend.from;

  const data = { from: sender, to: [to], subject, text, html };

  if (attachments?.length) {
    data.attachments = attachments.map((a) => ({
      filename: a.filename,
      content: readFileSync(a.path),
    }));
  }

  const result = await getResendClient().emails.send(data);

  // Se der erro, a API geralmente vem com `error` e `data: null`.
  // A gente precisa lançar para ativar fallback (brevo -> resend -> smtp).
  if (result?.error) {
    const errMsg = result?.error?.message || "Resend send error";
    throw new Error(errMsg);
  }

  // Resend pode retornar o identificador em campos diferentes dependendo da versão.
  const messageId =
    result?.data?.id ||
    result?.id ||
    result?.data?.email_id ||
    result?.data?.message_id ||
    null;

  return { provider: "resend", messageId };
}

// ─── Provider: Brevo (ex-Sendinblue) SMTP relay ─────────

let brevoTransporter = null;

function getBrevoTransporter() {
  if (!brevoTransporter) {
    brevoTransporter = nodemailer.createTransport({
      // O Brevo apresenta certificados com SAN/alt-names diferentes.
      // "smtp-relay.brevo.com" gera erro de hostname vs certificado e causa fallback para outro provedor.
      // Usamos o host correto que bate com o certificado.
      host: "smtp-relay.sendinblue.com",
      port: 587,
      secure: false,
      auth: { user: config.brevo.user, pass: config.brevo.pass },
    });
  }
  return brevoTransporter;
}

async function sendViaBrevo({ from, to, subject, text, html, attachments }) {
  const sender = from || config.brevo.from;
  const info = await getBrevoTransporter().sendMail({ from: sender, to, subject, text, html, attachments });
  return { provider: "brevo", messageId: info.messageId };
}

async function verifyBrevo() {
  await getBrevoTransporter().verify();
}

// ─── Provider registry ──────────────────────────────────

function getActiveProviders() {
  const providers = [];

  if (config.brevo.user && config.brevo.pass) {
    providers.push({ name: "brevo", send: sendViaBrevo });
  }
  if (config.resend.apiKey) {
    providers.push({ name: "resend", send: sendViaResend });
  }
  if (config.mailgun.apiKey && config.mailgun.domain) {
    providers.push({ name: "mailgun", send: sendViaMailgun });
  }
  if (config.smtp.user && config.smtp.pass) {
    providers.push({ name: "smtp", send: sendViaSMTP });
  }

  return providers;
}

// ─── Public API ─────────────────────────────────────────

export const mailerService = {
  getProviderNames() {
    return getActiveProviders().map((p) => p.name);
  },

  async verify() {
    const providers = this.getProviderNames();
    if (providers.length === 0) {
      return { ok: false, error: "No email providers configured", providers };
    }

    const result = { ok: true, providers };

    if (providers.includes("smtp")) {
      try {
        await verifySMTP();
        result.smtp = "connected";
      } catch (err) {
        result.smtp = err.message;
      }
    }

    if (providers.includes("brevo")) {
      try {
        await verifyBrevo();
        result.brevo = "connected";
      } catch (err) {
        result.brevo = err.message;
      }
    }

    const hasWorkingProvider =
      result.smtp === "connected" ||
      result.brevo === "connected" ||
      providers.includes("mailgun") ||
      providers.includes("resend");

    result.ok = hasWorkingProvider;

    return result;
  },

  async sendMail(options) {
    const providers = getActiveProviders();
    if (providers.length === 0) {
      throw new Error("No email providers configured. Set SMTP, Mailgun, Resend or Brevo credentials in .env");
    }

    const errors = [];

    for (const provider of providers) {
      try {
        const result = await provider.send(options);
        return result;
      } catch (err) {
        errors.push({ provider: provider.name, error: err.message });
        console.warn(`[Mailer] ${provider.name} failed: ${err.message}`);
      }
    }

    const summary = errors.map((e) => `${e.provider}: ${e.error}`).join(" | ");
    throw new Error(`All providers failed — ${summary}`);
  },
};
