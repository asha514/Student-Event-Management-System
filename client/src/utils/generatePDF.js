
  import jsPDF from "jspdf";

const generatePDF = (registration, event) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // ==========================
  // PAGE BACKGROUND
  // ==========================
  doc.setFillColor(247, 250, 255);
  doc.rect(0, 0, 210, 297, "F");

  // ==========================
  // HEADER
  // ==========================
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("EVENTHUB", 105, 14, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Digital Event Registration Pass", 105, 23, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.text("Student Event Management System", 105, 30, {
    align: "center",
  });

  // ==========================
  // VERIFIED BADGE
  // ==========================
  doc.setFillColor(22, 163, 74);
  doc.roundedRect(55, 42, 100, 10, 5, 5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("VERIFIED REGISTRATION", 105, 49, {
    align: "center",
  });

  // ==========================
  // STUDENT CARD
  // ==========================
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 58, 186, 82, 6, 6, "F");

  doc.setDrawColor(220);
  doc.roundedRect(12, 58, 186, 82, 6, 6);

  // Blue Title Strip
  doc.setFillColor(59, 130, 246);
  doc.roundedRect(12, 58, 186, 12, 6, 6, "F");

  doc.setTextColor(255,255,255);
  doc.setFont("helvetica","bold");
  doc.setFontSize(15);
  doc.text("STUDENT DETAILS",20,66);

  doc.setTextColor(40,40,40);
  doc.setFont("helvetica","normal");
  doc.setFontSize(12);

  doc.text(`Registration ID : ${registration?._id || "N/A"}`,20,82);
  doc.text(`Student Name    : ${registration?.name || "N/A"}`,20,92);
  doc.text(`College Name    : ${registration?.collegeName || "N/A"}`,20,102);
  doc.text(`Year            : ${registration?.year || "N/A"}`,20,112);
  doc.text(`Email           : ${registration?.email || "N/A"}`,20,122);
  doc.text(`Phone           : ${registration?.phone || "N/A"}`,20,132);
    // ==========================
  // EVENT DETAILS CARD
  // ==========================

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 148, 186, 82, 6, 6, "F");

  doc.setDrawColor(220);
  doc.roundedRect(12, 148, 186, 82, 6, 6);

  // Title Strip
  doc.setFillColor(124, 58, 237);
  doc.roundedRect(12, 148, 186, 12, 6, 6, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("EVENT DETAILS", 20, 156);

  const eventDate = event?.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "To Be Announced";

  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  doc.text(`Event Name   : ${event?.title || "N/A"}`, 20, 172);
  doc.text(`Department   : ${event?.department || "General"}`, 20, 182);
  doc.text(`Venue        : ${event?.location || "TBA"}`, 20, 192);
  doc.text(`Event Date   : ${eventDate}`, 20, 202);
  doc.text(`Event Time   : ${event?.time || "10:00 AM"}`, 20, 212);

  // VERIFIED BADGE
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(145, 168, 40, 12, 4, 4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("VERIFIED", 165, 176, {
    align: "center",
  });

  // ==========================
  // IMPORTANT INSTRUCTIONS
  // ==========================

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(12, 238, 186, 34, 6, 6, "F");

  doc.setDrawColor(225);
  doc.roundedRect(12, 238, 186, 34, 6, 6);

  doc.setTextColor(37, 99, 235);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("IMPORTANT INSTRUCTIONS", 20, 248);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);

  doc.text("• Bring your College ID Card.", 20, 256);
  doc.text("• Arrive at least 30 minutes before the event.", 20, 262);
  doc.text("• Show this digital pass at the registration desk.", 20, 268);
    // ==========================
  // QR CODE PLACEHOLDER
  // ==========================

  doc.setDrawColor(180);
  doc.setFillColor(255, 255, 255);
  doc.rect(20, 276, 30, 30, "FD");

  doc.setTextColor(120);
  doc.setFontSize(8);
  doc.text("QR CODE", 35, 292, {
    align: "center",
  });

  // ==========================
  // REGISTRATION ID BOX
  // ==========================

  doc.setFillColor(239, 246, 255);
  doc.roundedRect(60, 276, 138, 18, 4, 4, "F");

  doc.setTextColor(37, 99, 235);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Registration ID", 68, 284);

  doc.setTextColor(40, 40, 40);
  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  doc.text(
    registration?._id || "N/A",
    68,
    290
  );

  // ==========================
  // SIGNATURE
  // ==========================

  doc.setDrawColor(160);
  doc.line(135, 302, 190, 302);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text("Event Coordinator", 145, 307);

  // ==========================
  // FOOTER
  // ==========================

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 285, 210, 12, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(
    "Generated by EventHub | Student Event Management System | © 2026",
    105,
    292,
    { align: "center" }
  );

  // ==========================
  // SAVE PDF
  // ==========================

  const fileName = `EventHub_Pass_${registration?.name || "Student"}.pdf`;

  doc.save(fileName);
};

export default generatePDF;