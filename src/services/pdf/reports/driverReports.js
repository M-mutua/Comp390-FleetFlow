import { createDoc, drawHeader, drawFooter, sectionHeading, BRAND, autoTable } from "../pdfBase";

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function generateDriverTripHistory(data) {
  const trips = safeArray(data?.trips);
  const doc = createDoc("landscape");
  let y = drawHeader(doc, "My Trip History");
  y = sectionHeading(doc, "Completed Trips", y);

  autoTable(doc, {
    startY: y,
    head: [["ID", "Date", "Route/Destination", "Start Mileage", "End Mileage", "Comments"]],
    body: trips.length
      ? trips.map((trip) => [
          trip.id || "-",
          trip.date || trip.createdAt || "-",
          trip.destination || "N/A",
          trip.startMileage || "N/A",
          trip.endMileage || "N/A",
          trip.comments || "N/A",
        ])
      : [["-", "-", "-", "-", "-", "No trips found"]],
    theme: "grid",
    styles: { fontSize: BRAND.fontSize.tableBody },
    headStyles: { fillColor: BRAND.teal, textColor: 255 },
  });

  drawFooter(doc);
  return doc;
}

export function generateDriverFuelReceipts(data) {
  const receipts = safeArray(data?.receipts);
  const doc = createDoc("portrait");
  let y = drawHeader(doc, "My Submitted Fuel Receipts");
  y = sectionHeading(doc, "Fuel Submissions", y);

  autoTable(doc, {
    startY: y,
    head: [["Date", "Receipt #", "Log ID", "Liters", "Cost"]],
    body: receipts.length
      ? receipts.map((receipt) => [
          receipt.date || receipt.createdAt || "-",
          receipt.receiptNumber || "-",
          receipt.tripLogId || receipt.id || "-",
          receipt.liters || "-",
          receipt.amount || receipt.cost || "-",
        ])
      : [["-", "-", "-", "-", "No fuel receipts found"]],
    theme: "grid",
    styles: { fontSize: BRAND.fontSize.tableBody },
    headStyles: { fillColor: BRAND.teal, textColor: 255 },
  });

  drawFooter(doc);
  return doc;
}
