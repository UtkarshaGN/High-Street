export function generateBookingsXML(bookings) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<bookings>\n`;

  bookings.forEach(b => {
    xml += `
  <booking>
    <bookingId>${b.bookingId}</bookingId>
    <status>${b.status}</status>
    <userId>${b.userId}</userId>
    <sessionId>${b.sessionId}</sessionId>

    <member>
      <firstName>${b.firstName}</firstName>
      <lastName>${b.lastName}</lastName>
    </member>

    <session>
      <date>${b.sessionDate}</date>
      <startTime>${b.startTime}</startTime>
      <activity>${b.activityName}</activity>
    </session>
  </booking>`;
  });

  xml += `\n</bookings>`;

  return xml;
}
