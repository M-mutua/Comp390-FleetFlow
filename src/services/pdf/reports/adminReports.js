import { createDoc, drawHeader, drawFooter, sectionHeading, BRAND, autoTable } from "../pdfBase";

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function drawSummaryRow(doc, y, items) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const { left, right } = BRAND.margins;
  const contentWidth = pageWidth - left - right;
  const colWidth = contentWidth / items.length;

  autoTable(doc, {
    startY: y,
    margin: { left, right },
    theme: "plain",
    styles: { fontSize: BRAND.fontSize.tableBody, cellPadding: 4 },
    columnStyles: items.reduce((acc, _item, index) => {
      acc[index] = { cellWidth: colWidth };
      return acc;
    }, {}),
    body: [
      items.map((item) => ({
        content: `${item.label}\n${item.value}`,
        styles: {
          fontStyle: "bold",
          halign: "center",
          fillColor: item.fill || BRAND.tealLight,
          textColor: item.text || BRAND.textDark,
        },
      })),
    ],
  });

  return doc.lastAutoTable.finalY + 8;
}

export function generateAdminFullTripHistory(data) {
  const trips = safeArray(data?.trips);
  const doc = createDoc("landscape");
  let y = drawHeader(doc, "Full Trip History Report");

  const uniqueVehicles = new Set(trips.map((trip) => trip.vehiclePlate).filter(Boolean)).size;
  const uniqueDrivers = new Set(trips.map((trip) => trip.driverName).filter(Boolean)).size;
  const completed = trips.filter((trip) => String(trip.status).toUpperCase() === "COMPLETED").length;

  y = drawSummaryRow(doc, y, [
    { label: "Total Trips", value: trips.length },
    { label: "Vehicles Active", value: uniqueVehicles },
    { label: "Drivers Active", value: uniqueDrivers },
    { label: "Completed", value: completed, fill: [220, 252, 231], text: [22, 101, 52] },
  ]);

  y = sectionHeading(doc, "Trip History", y);
  autoTable(doc, {
    startY: y,
    head: [["ID", "Date", "Staff", "Driver", "Vehicle", "Status"]],
    body: trips.length
      ? trips.map((trip) => [
          trip.id || "-",
          trip.date || "-",
          trip.requesterName || "-",
          trip.driverName || "-",
          trip.vehiclePlate || "-",
          trip.status || "-",
        ])
      : [["-", "-", "-", "-", "-", "No trips found"]],
    theme: "grid",
    styles: { fontSize: BRAND.fontSize.tableBody },
    headStyles: { fillColor: BRAND.teal, textColor: 255 },
    didParseCell: (hookData) => {
      if (hookData.section !== "body" || hookData.column.index !== 5) return;
      const status = String(hookData.cell.raw || "").toUpperCase();
      if (status.includes("APPROVED") || status.includes("COMPLETED")) {
        hookData.cell.styles.textColor = [22, 101, 52];
      } else if (status.includes("REJECT") || status.includes("CANCEL")) {
        hookData.cell.styles.textColor = [185, 28, 28];
      } else if (status.includes("PENDING")) {
        hookData.cell.styles.textColor = [180, 83, 9];
      }
    },
  });

  drawFooter(doc);
  return doc;
}

export function generateAdminVehicleUtilization(data) {
  const trips = safeArray(data?.trips);
  const doc = createDoc("portrait");
  let y = drawHeader(doc, "Vehicle Utilization Report");

  const utilization = trips.reduce((acc, trip) => {
    const key = trip.vehiclePlate || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  y = drawSummaryRow(doc, y, [
    { label: "Total Trips", value: trips.length },
    { label: "Vehicles Used", value: Object.keys(utilization).length },
    { label: "Most Used", value: Object.entries(utilization).sort((a, b) => b[1] - a[1])[0]?.[0] || "-" },
    { label: "Least Used", value: Object.entries(utilization).sort((a, b) => a[1] - b[1])[0]?.[0] || "-" },
  ]);

  y = sectionHeading(doc, "Utilization Summary", y);
  autoTable(doc, {
    startY: y,
    head: [["Vehicle Plate", "Total Trips Assigned"]],
    body: Object.keys(utilization).length
      ? Object.entries(utilization).map(([plate, count]) => [plate, count])
      : [["-", "No trips found"]],
    theme: "grid",
    styles: { fontSize: BRAND.fontSize.tableBody },
    headStyles: { fillColor: BRAND.teal, textColor: 255 },
  });

  drawFooter(doc);
  return doc;
}

export function generateAdminDriverSummary(data) {
  const trips = safeArray(data?.trips);
  const doc = createDoc("portrait");
  let y = drawHeader(doc, "Driver Activity Summary");

  const activity = trips.reduce((acc, trip) => {
    const key = trip.driverName || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  y = drawSummaryRow(doc, y, [
    { label: "Total Trips", value: trips.length },
    { label: "Drivers", value: Object.keys(activity).length },
    { label: "Top Driver", value: Object.entries(activity).sort((a, b) => b[1] - a[1])[0]?.[0] || "-" },
    { label: "Least Active", value: Object.entries(activity).sort((a, b) => a[1] - b[1])[0]?.[0] || "-" },
  ]);

  y = sectionHeading(doc, "Trips Completed Per Driver", y);
  autoTable(doc, {
    startY: y,
    head: [["Driver Name", "Trips Handled"]],
    body: Object.keys(activity).length
      ? Object.entries(activity).map(([name, count]) => [name, count])
      : [["-", "No trips found"]],
    theme: "grid",
    styles: { fontSize: BRAND.fontSize.tableBody },
    headStyles: { fillColor: BRAND.teal, textColor: 255 },
  });

  drawFooter(doc);
  return doc;
}

export function generateAdminFuelExpenditure(data) {
  const fuelRecords = safeArray(data?.fuelRecords);
  const doc = createDoc("portrait");
  let y = drawHeader(doc, "Fuel Expenditure Report");

  const totalLiters = fuelRecords.reduce((acc, item) => acc + Number(item.liters || 0), 0);
  const totalCost = fuelRecords.reduce((acc, item) => acc + Number(item.cost || item.amount || 0), 0);

  y = drawSummaryRow(doc, y, [
    { label: "Total Receipts", value: fuelRecords.length },
    { label: "Total Liters", value: totalLiters.toFixed(1) },
    { label: "Total Cost", value: totalCost ? `KES ${totalCost.toFixed(0)}` : "KES 0" },
    { label: "Vehicles", value: new Set(fuelRecords.map((item) => item.vehiclePlate)).size },
  ]);

  y = sectionHeading(doc, "Fuel Costs Across Vehicles", y);
  autoTable(doc, {
    startY: y,
    head: [["Date", "Vehicle", "Driver", "Liters", "Cost (KES)"]],
    body: fuelRecords.length
      ? fuelRecords.map((record) => [
          record.date || record.createdAt || "-",
          record.vehiclePlate || "-",
          record.driverName || "-",
          record.liters || "-",
          record.cost || record.amount || "-",
        ])
      : [["-", "-", "-", "-", "No fuel records found"]],
    theme: "grid",
    styles: { fontSize: BRAND.fontSize.tableBody },
    headStyles: { fillColor: BRAND.teal, textColor: 255 },
  });

  drawFooter(doc);
  return doc;
}
