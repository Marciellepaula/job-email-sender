export function buildEmailSubject(companyName, customSubject) {
  if (customSubject) {
    return customSubject.replace(/\{company\}/gi, companyName);
  }
  return `Candidatura para Vaga de Desenvolvedor(a) de Software — ${companyName}`;
}

export function buildEmailText({ recruiterName, companyName }, customMessage) {
  if (customMessage) {
    const recruiter = recruiterName?.trim() || "Equipe de Recrutamento";
    return customMessage
      .replace(/\{recruiter\}/gi, recruiter)
      .replace(/\{company\}/gi, companyName);
  }

  const greeting = recruiterName?.trim()
    ? `Olá ${recruiterName}`
    : "Olá Equipe de Recrutamento";

  return `${greeting},

Meu nome é Marcielle Paula e sou desenvolvedora de software com experiência em Node.js, React, Laravel e desenvolvimento de APIs.

Tenho muito interesse em oportunidades na ${companyName}. Segue meu currículo em anexo para sua apreciação.

Agradeço pela atenção e fico no aguardo de um retorno.

Atenciosamente,
Marcielle Paula`;
}

export function buildEmailHtml({ recruiterName, companyName }, customMessage) {
  if (customMessage) {
    const recruiter = recruiterName?.trim() || "Equipe de Recrutamento";
    const text = customMessage
      .replace(/\{recruiter\}/gi, recruiter)
      .replace(/\{company\}/gi, companyName);

    const htmlBody = text
      .split("\n\n")
      .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
      .join("\n");

    return `<div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; line-height: 1.7; max-width: 600px;">${htmlBody}</div>`;
  }

  const greeting = recruiterName?.trim()
    ? `Olá <strong>${recruiterName}</strong>`
    : "Olá <strong>Equipe de Recrutamento</strong>";

  return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; line-height: 1.7; max-width: 600px;">
  <p>${greeting},</p>

  <p>Meu nome é <strong>Marcielle Paula</strong> e sou desenvolvedora de software com experiência em
  <strong>Node.js</strong>, <strong>React</strong>, <strong>Laravel</strong> e <strong>desenvolvimento de APIs</strong>.</p>

  <p>Tenho muito interesse em oportunidades na <strong>${companyName}</strong>.
  Segue meu currículo em anexo para sua apreciação.</p>

  <p>Agradeço pela atenção e fico no aguardo de um retorno.</p>

  <br/>
  <p>Atenciosamente,<br/>
  <strong>Marcielle Paula</strong><br/>
  <span style="color: #666; font-size: 13px;">Desenvolvedora de Software</span></p>
</div>`;
}
