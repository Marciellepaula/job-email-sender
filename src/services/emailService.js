import { existsSync } from "fs";
import { resolve } from "path";
import { config } from "../config/index.js";
import { mailerService } from "./mailerService.js";
import { statSync } from "fs";
import { contactRepository } from "../repositories/contactRepository.js";
import { sentLogRepository } from "../repositories/sentLogRepository.js";
import {
  buildEmailSubject,
  buildEmailText,
  buildEmailHtml,
} from "../../templates/emailTemplate.js";
import { AppError } from "../utils/AppError.js";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function findResume() {
  const paths = [resolve("data/resume.pdf"), resolve("uploads/resume.pdf")];
  return paths.find((p) => existsSync(p)) || null;
}

let sendingInProgress = false;
let sendingResults = [];

export const emailService = {
  isSending() {
    return sendingInProgress;
  },

  getResults() {
    return sendingResults;
  },

  async sendAll({ subject: customSubject, message: customMessage, contactIds } = {}, onProgress) {
    if (sendingInProgress) {
      throw new AppError("Already sending emails", 409);
    }

    let contacts = await contactRepository.findAll();
    if (contactIds && contactIds.length > 0) {
      const idSet = new Set(contactIds);
      contacts = contacts.filter((c) => idSet.has(c.id));
    }
    if (contacts.length === 0) {
      throw new AppError("No contacts found", 400);
    }

    sendingInProgress = true;
    sendingResults = [];
    const resumePath = findResume();
    const hasAttachment = !!resumePath;
    const results = [];
    const fromAddress = config.brevo.from
      || config.resend.from
      || config.mailgun.from
      || `"${config.senderName}" <${config.smtp.user}>`;

    console.log(`[Email] Resume path: ${resumePath || "NOT FOUND"}`);
    console.log(`[Email] From: ${fromAddress}`);
    console.log(`[Email] Providers: ${mailerService.getProviderNames().join(" → ")}`);
    if (customSubject) console.log(`[Email] Custom subject: ${customSubject}`);

    try {
      for (let i = 0; i < contacts.length; i++) {
        const { companyName, email, recruiterName } = contacts[i];
        const emailSubject = buildEmailSubject(companyName, customSubject);

        try {
          const { provider, messageId } = await mailerService.sendMail({
            from: fromAddress,
            to: email,
            subject: emailSubject,
            text: buildEmailText({ recruiterName, companyName }, customMessage),
            html: buildEmailHtml({ recruiterName, companyName }, customMessage),
            attachments: resumePath
              ? [{ filename: "Marcielle_Paula_Resume.pdf", path: resumePath }]
              : [],
          });

          const entry = {
            email,
            companyName,
            recruiterName: recruiterName || null,
            status: "sent",
            provider,
            messageId: messageId || null,
            subject: emailSubject,
            hasAttachment,
          };
          await sentLogRepository.create(entry);
          results.push(entry);
          onProgress?.(entry);
          const attachInfo = resumePath ? `(+CV ${Math.round(statSync(resumePath).size / 1024)}KB)` : "(no CV)";
          console.log(`[${i + 1}/${contacts.length}] Sent to ${email} via ${provider} ${attachInfo}`);
        } catch (err) {
          const entry = {
            email,
            companyName,
            recruiterName: recruiterName || null,
            status: "failed",
            provider: null,
            subject: emailSubject,
            hasAttachment,
            error: err.message,
          };
          await sentLogRepository.create(entry);
          results.push(entry);
          onProgress?.(entry);
          console.error(`[${i + 1}/${contacts.length}] Failed: ${email} - ${err.message}`);
        }

        if (i < contacts.length - 1) await sleep(config.delayMs);
      }
    } finally {
      sendingResults = results;
      sendingInProgress = false;
    }

    return results;
  },

  async getLogs() {
    return sentLogRepository.findAll();
  },

  async clearLogs() {
    return sentLogRepository.deleteAll();
  },

  resumeExists() {
    return !!findResume();
  },
};
