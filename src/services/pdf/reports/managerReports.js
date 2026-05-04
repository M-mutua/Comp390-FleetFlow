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

export function generateManagerActiveAssignments(data) {
  const assignments = safeArray(data?.assignments);
  const doc = createDoc("landscape");
  let y = drawHeader(doc, "Active & Upcoming Assignments");

  const active = assignments.filter((item) => String(item.status).toUpperCase() === "ASSIGNED").length;
  const scheduled = assignments.filter((item) => String(item.status).toUpperCase() === "PLANNED").length;

  y = drawSummaryRow(doc, y, [
    { label: "Total Assignments", value: assignments.length },
    { label: "Active", value: active, fill: [219, 234, 254], text: [30, 64, 175] },
    { label: "Scheduled", value: scheduled, fill: [255, 247, 230], text: [180, 83, 9] },
    { label: "Drivers", value: new Set(assignments.map((item) => item.driverName || item.driverId)).size },
  ]);

  y = sectionHeading(doc, "Assignments", y);
  autoTable(doc, {
    startY: y,
    head: [["ID", "Date", "Vehicle", "Driver", "Destination", "Status"]],
    body: assignments.length
      ? assignments.map((assignment) => [
          assignment.id || "-",
          assignment.tripDate || assignment.createdAt || "-",
          assignment.vehiclePlateNumber || assignment.vehicleId || "-",
          assignment.driverName || assignment.driverId || "-",
          assignment.destination || "-",
          assignment.status || "-",
        ])
      : [["-", "-", "-", "-", "-", "No assignments found"]],
    theme: "grid",
    styles: { fontSize: BRAND.fontSize.tableBody },
    headStyles: { fillColor: BRAND.teal, textColor: 255 },
  });

  drawFooter(doc);
  return doc;
}

export function generateManagerVehicleStatus(data) {
  const vehicles = safeArray(data?.vehicles);
  const doc = createDoc("portrait");
  let y = drawHeader(doc, "Vehicle Status Report");

  const available = vehicles.filter((item) => item.status === "AVAILABLE").length;
  const inUse = vehicles.filter((item) => item.status === "IN_USE").length;
  const maintenance = vehicles.filter((item) => item.status === "MAINTENANCE").length;

  y = drawSummaryRow(doc, y, [
    { label: "Total Vehicles", value: vehicles.length },
    { label: "Available", value: available, fill: [220, 252, 231], text: [22, 101, 52] },
    { label: "In Use", value: inUse, fill: [254, 243, 199], text: [146, 64, 14] },
    { label: "Maintenance", value: maintenance, fill: [254, 226, 226], text: [153, 27, 27] },
  ]);

  y = sectionHeading(doc, "Current Fleet Status", y);
  autoTable(doc, {
    startY: y,
    head: [["Plate Number", "Model", "Capacity", "Status"]],
    body: vehicles.length
      ? vehicles.map((vehicle) => [
          vehicle.plateNumber || vehicle.registrationNumber || "-",
          vehicle.model || "-",
          vehicle.capacity || "-",
          vehicle.status || "-",
        ])
      : [["-", "-", "-", "No vehicles found"]],
    theme: "grid",
    styles: { fontSize: BRAND.fontSize.tableBody },
    headStyles: { fillColor: BRAND.teal, textColor: 255 },
  });

  drawFooter(doc);
  return doc;
}

export function generateManagerMileageReport(data) {
  const vehicles = safeArray(data?.vehicles);
  const doc = createDoc("portrait");
  let y = drawHeader(doc, "Vehicle Mileage Report");

  const overdue = vehicles.filter((item) => Number(item.currentMileage || 0) >= Number(item.nextServiceMileage || 0)).length;
  y = drawSummaryRow(doc, y, [
    { label: "Vehicles", value: vehicles.length },
    { label: "Flagged", value: overdue, fill: [254, 226, 226], text: [153, 27, 27] },
    { label: "Avg Mileage", value: vehicles.length ? Math.round(vehicles.reduce((acc, item) => acc + Number(item.currentMileage || 0), 0) / vehicles.length) : 0 },
    { label: "Next Service", value: "Based on mileage" },
  ]);

  y = sectionHeading(doc, "Mileage Summary to Flag Servicing", y);
  autoTable(doc, {
    startY: y,
    head: [["Plate Number", "Current Mileage", "Last Service", "Status"]],
    body: vehicles.length
      ? vehicles.map((vehicle) => [
          vehicle.plateNumber || vehicle.registrationNumber || "-",
          vehicle.currentMileage || "N/A",
          vehicle.lastServiceMileage || "N/A",
          vehicle.status || "-",
        ])
      : [["-", "-", "-", "No vehicles found"]],
    theme: "grid",
    styles: { fontSize: BRAND.fontSize.tableBody },
    headStyles: { fillColor: BRAND.teal, textColor: 255 },
  });

  drawFooter(doc);
  return doc;
}

export function generateManagerFuelSummary(data) {
  const fuelRecords = safeArray(data?.fuelRecords);
  const doc = createDoc("portrait");
  let y = drawHeader(doc, "Fuel Receipt Summary");

  const totalLiters = fuelRecords.reduce((acc, item) => acc + Number(item.liters || 0), 0);
  const totalAmount = fuelRecords.reduce((acc, item) => acc + Number(item.amount || item.cost || 0), 0);

  y = drawSummaryRow(doc, y, [
    { label: "Receipts", value: fuelRecords.length },
    { label: "Total Liters", value: totalLiters.toFixed(1) },
    { label: "Total Amount", value: totalAmount ? `KES ${totalAmount.toFixed(0)}` : "KES 0" },
    { label: "Trips", value: new Set(fuelRecords.map((item) => item.tripLogId || item.id)).size },
  ]);

  y = sectionHeading(doc, "Fuel Summary per Trip", y);
  autoTable(doc, {
    startY: y,
    head: [["Trip/Log ID", "Receipt #", "Liters", "Amount"]],
    body: fuelRecords.length
      ? fuelRecords.map((record) => [
          record.tripLogId || record.id || "-",
          record.receiptNumber || "-",
          record.liters || "-",
          record.amount || record.cost || "-",
        ])
      : [["-", "-", "-", "No fuel records found"]],
    theme: "grid",
    styles: { fontSize: BRAND.fontSize.tableBody },
    headStyles: { fillColor: BRAND.teal, textColor: 255 },
  });

  drawFooter(doc);
  return doc;
}
