import { existsSync } from "fs";
import { resolve } from "path";
import { config } from "../config/index.js";
import { mailerService } from "./mailerService.js";
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

  async sendAll(onProgress) {
    if (sendingInProgress) {
      throw new AppError("Already sending emails", 409);
    }

    const contacts = await contactRepository.findAll();
    if (contacts.length === 0) {
      throw new AppError("No contacts found", 400);
    }

    sendingInProgress = true;
    sendingResults = [];
    const resumePath = findResume();
    const results = [];
    const fromAddress = `"${config.senderName}" <${config.smtp.user || config.mailgun.from || config.resend.from}>`;

    try {
      for (let i = 0; i < contacts.length; i++) {
        const { companyName, email, recruiterName } = contacts[i];

        const alreadySent = await sentLogRepository.findSentByEmail(email);
        if (alreadySent) {
          const skip = { email, companyName, status: "skipped", reason: "already sent" };
          await sentLogRepository.create(skip);
          results.push(skip);
          onProgress?.(skip);
          continue;
        }

        try {
          const { provider } = await mailerService.sendMail({
            from: fromAddress,
            to: email,
            subject: buildEmailSubject(companyName),
            text: buildEmailText({ recruiterName, companyName }),
            html: buildEmailHtml({ recruiterName, companyName }),
            attachments: resumePath
              ? [{ filename: "Marcielle_Paula_Resume.pdf", path: resumePath }]
              : [],
          });

          const entry = { email, companyName, status: "sent" };
          await sentLogRepository.create(entry);
          results.push(entry);
          onProgress?.(entry);
          console.log(`[${i + 1}/${contacts.length}] Sent to ${email} via ${provider}`);
        } catch (err) {
          const entry = { email, companyName, status: "failed", error: err.message };
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
