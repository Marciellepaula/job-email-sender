export function buildEmailSubject(companyName) {
  return `Application for Software Developer Position — ${companyName}`;
}

export function buildEmailText({ recruiterName, companyName }) {
  const greeting = recruiterName?.trim()
    ? `Hello ${recruiterName}`
    : "Hello Hiring Team";

  return `${greeting},

My name is Marcielle Paula and I am a software developer with experience in Node.js, React, Laravel, and API development.

I am very interested in opportunities at ${companyName}. Please find my resume attached for your consideration.

Thank you for your time and I look forward to hearing from you.

Best regards,
Marcielle Paula`;
}

export function buildEmailHtml({ recruiterName, companyName }) {
  const greeting = recruiterName?.trim()
    ? `Hello <strong>${recruiterName}</strong>`
    : "Hello <strong>Hiring Team</strong>";

  return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; line-height: 1.7; max-width: 600px;">
  <p>${greeting},</p>

  <p>My name is <strong>Marcielle Paula</strong> and I am a software developer with experience in
  <strong>Node.js</strong>, <strong>React</strong>, <strong>Laravel</strong>, and <strong>API development</strong>.</p>

  <p>I am very interested in opportunities at <strong>${companyName}</strong>.
  Please find my resume attached for your consideration.</p>

  <p>Thank you for your time and I look forward to hearing from you.</p>

  <br/>
  <p>Best regards,<br/>
  <strong>Marcielle Paula</strong><br/>
  <span style="color: #666; font-size: 13px;">Software Developer</span></p>
</div>`;
}
