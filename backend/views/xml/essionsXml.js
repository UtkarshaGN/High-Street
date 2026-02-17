export function generateSessionsXML(sessions) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sessions>\n`;

  sessions.forEach(s => {
    xml += `
  <session>
    <id>${s.sessionId}</id>
    <trainer>${s.trainerName}</trainer>
    <date>${s.sessionDate}</date>
    <time>${s.startTime}</time>
    <activity>${s.activityName}</activity>
  </session>`;
  });

  xml += `\n</sessions>`;

  return xml;
}
