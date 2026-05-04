import { createDoc, drawHeader, drawFooter, sectionHeading, BRAND, autoTable } from "../pdfBase";

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function generateDeanPendingRequests(data) {
  const requests = safeArray(data?.requests);
  const doc = createDoc("portrait");
  let y = drawHeader(doc, "Pending Trip Requests");
  y = sectionHeading(doc, "Awaiting Dean Approval", y);

  autoTable(doc, {
    startY: y,
    head: [["Request ID", "Date", "Staff Name", "Destination", "Passenger Count"]],
    body: requests.length
      ? requests.map((request) => [
          request.id || "-",
          request.departureTime ? new Date(request.departureTime).toLocaleDateString() : "-",
          request.requesterName || request.requester || "N/A",
          request.destination || "-",
          request.passengers || "-",
        ])
      : [["-", "-", "-", "-", "No pending requests"]],
    theme: "grid",
    styles: { fontSize: BRAND.fontSize.tableBody },
    headStyles: { fillColor: BRAND.teal, textColor: 255 },
  });

  drawFooter(doc);
  return doc;
}
