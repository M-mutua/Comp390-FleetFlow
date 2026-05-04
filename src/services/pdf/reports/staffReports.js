import { createDoc, drawHeader, drawFooter, sectionHeading, BRAND, autoTable } from "../pdfBase";

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function generateStaffRequestStatus(data) {
  const requests = safeArray(data?.requests);
  const doc = createDoc("portrait");
  let y = drawHeader(doc, "My Trip Requests Status");
  y = sectionHeading(doc, "Active Requests", y);

  autoTable(doc, {
    startY: y,
    head: [["ID", "Date", "Destination", "Status"]],
    body: requests.length
      ? requests.map((request) => [
          request.id || "-",
          request.departureTime ? new Date(request.departureTime).toLocaleDateString() : "-",
          request.destination || "-",
          request.status || "-",
        ])
      : [["-", "-", "-", "No requests found"]],
    theme: "grid",
    styles: { fontSize: BRAND.fontSize.tableBody },
    headStyles: { fillColor: BRAND.teal, textColor: 255 },
  });

  drawFooter(doc);
  return doc;
}

export function generateStaffTripHistory(data) {
  const requests = safeArray(data?.requests);
  const doc = createDoc("landscape");
  let y = drawHeader(doc, "My Past Trips History");
  y = sectionHeading(doc, "Completed Trip Requests", y);

  autoTable(doc, {
    startY: y,
    head: [["ID", "Date", "Destination", "Reason", "Status"]],
    body: requests.length
      ? requests.map((request) => [
          request.id || "-",
          request.departureTime ? new Date(request.departureTime).toLocaleDateString() : "-",
          request.destination || "-",
          request.reason || request.purpose || "-",
          request.status || "-",
        ])
      : [["-", "-", "-", "-", "No trip history found"]],
    theme: "grid",
    styles: { fontSize: BRAND.fontSize.tableBody },
    headStyles: { fillColor: BRAND.teal, textColor: 255 },
  });

  drawFooter(doc);
  return doc;
}
