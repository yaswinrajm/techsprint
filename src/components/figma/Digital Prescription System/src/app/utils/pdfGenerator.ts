import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Prescription, DoctorSettings } from '../context/AppContext';

export const generatePrescriptionPDF = (
    prescription: Prescription,
    doctorSettings: DoctorSettings
) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(14, 116, 144); // Cyan-700
    doc.text(doctorSettings.clinicName || 'MediScript Health Center', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105); // Slate-600
    doc.text(doctorSettings.name || 'Dr. Sarah Anderson', pageWidth / 2, 28, { align: 'center' });
    doc.text(doctorSettings.qualification || 'MBBS, MD', pageWidth / 2, 34, { align: 'center' });

    // Contact info
    doc.setFontSize(10);
    const addressLines = (doctorSettings.address || '123 Medical Plaza').split('\n');
    addressLines.forEach((line, i) => {
        doc.text(line, pageWidth / 2, 42 + i * 5, { align: 'center' });
    });
    doc.text(doctorSettings.phone || '+1 (555) 123-4567', pageWidth / 2, 42 + addressLines.length * 5, { align: 'center' });

    // Divider
    doc.setDrawColor(14, 116, 144);
    doc.setLineWidth(0.5);
    doc.line(20, 55, pageWidth - 20, 55);

    // Patient Details
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text('Patient Information', 20, 65);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Name: ${prescription.patientName}`, 20, 73);
    doc.text(`Age: ${prescription.age} years`, 100, 73);
    doc.text(`Gender: ${prescription.gender}`, 150, 73);
    doc.text(`Date: ${prescription.date}`, 20, 80);

    // Diagnosis
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Diagnosis', 20, 92);
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(prescription.diagnosis, 20, 100);

    // Medicines Table
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Prescribed Medicines', 20, 115);

    const tableData = prescription.medicines.map((med, index) => [
        (index + 1).toString(),
        med.drugName,
        med.dosage,
        med.frequency,
        med.duration,
        med.instructions,
    ]);

    autoTable(doc, {
        startY: 120,
        head: [['#', 'Medicine', 'Dosage', 'Frequency', 'Duration', 'Instructions']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [14, 116, 144],
            textColor: 255,
            fontStyle: 'bold',
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 40 },
            2: { cellWidth: 25 },
            3: { cellWidth: 30 },
            4: { cellWidth: 25 },
            5: { cellWidth: 40 },
        },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 180;

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text('Doctor\'s Signature:', pageWidth - 70, finalY + 30);
    doc.line(pageWidth - 70, finalY + 45, pageWidth - 20, finalY + 45);
    doc.text(doctorSettings.name || 'Dr. Sarah Anderson', pageWidth - 70, finalY + 52);

    // Save
    const fileName = `${prescription.patientName.replace(/\s+/g, '_')}_Prescription_${prescription.date}.pdf`;
    doc.save(fileName);
};
