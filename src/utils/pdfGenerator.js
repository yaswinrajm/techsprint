import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePrescriptionPDF = (prescription, clinicSettings) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // --- Header ---
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text(clinicSettings.clinicName || "Medical Clinic", margin, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);

    // Clinic Address (Right aligned)
    const addressLines = (clinicSettings.address || "123 Health Street, Wellness City").split('\n');
    let yPos = 20;
    doc.text(addressLines, pageWidth - margin, yPos, { align: "right" });
    yPos += (addressLines.length * 6) + 5;

    if (clinicSettings.phone) {
        doc.text(`Phone: ${clinicSettings.phone}`, pageWidth - margin, yPos, { align: "right" });
    }

    // Doctor Details (Left aligned under Clinic Name)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50);
    doc.text(clinicSettings.doctorName || "Dr. Name", margin, 32);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(clinicSettings.qualification || "MBBS, MD", margin, 38);

    // Divider Line
    doc.setDrawColor(200);
    doc.line(margin, 50, pageWidth - margin, 50);

    // --- Patient Details ---
    const patientY = 65;
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Details", margin, patientY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const { name, age, gender, date } = prescription.patientData;

    doc.text(`Name: ${name}`, margin, patientY + 8);
    doc.text(`Age/Gender: ${age} / ${gender}`, margin, patientY + 14);
    doc.text(`Date: ${date}`, pageWidth - margin, patientY + 8, { align: "right" });

    if (prescription.diagnosis) {
        doc.text(`Diagnosis: ${prescription.diagnosis}`, margin, patientY + 24);
    }

    // --- Medicines Table ---
    const tableY = patientY + 35;

    const tableColumn = ["Medicine", "Dosage", "Frequency", "Duration", "Instruction"];
    const tableRows = (prescription.medicines || []).map(med => [
        med.name,
        med.dosage,
        med.frequency,
        med.duration,
        med.instruction
    ]);

    doc.autoTable({
        startY: tableY,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [14, 116, 144] }, // Cyan 700
        styles: { fontSize: 10, cellPadding: 3 },
    });

    // --- Footer ---
    const finalY = doc.lastAutoTable.finalY + 40;

    // Signature
    doc.line(pageWidth - margin - 50, finalY, pageWidth - margin, finalY);
    doc.setFontSize(10);
    doc.text("Doctor's Signature", pageWidth - margin - 25, finalY + 5, { align: "center" });

    // Disclaimer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("This is a computer-generated prescription.", pageWidth / 2, pageHeight - 10, { align: "center" });

    // Save
    const fileName = `${name.replace(/\s+/g, '_')}_Prescription.pdf`;
    doc.save(fileName);
};
