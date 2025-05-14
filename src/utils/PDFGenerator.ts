import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'; // Import autotable correctly
import { FinancialReportItem } from "../types/report";

// No need for the declare module section since we import autoTable directly

class PDFGenerator {
  static generateFinancialReport = (
    data: FinancialReportItem[],
    startDateStr: string,
    endDateStr: string
  ) => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Make sure autotable has been added to jsPDF
      if (typeof autoTable !== 'function') {
        console.error('jsPDF-AutoTable plugin is not properly loaded');
        return false;
      }

      // Add title
      doc.setFontSize(18);
      doc.text("Financial Report", 14, 22);

      // Add date range
      doc.setFontSize(12);
      doc.text(`Period: ${startDateStr} to ${endDateStr}`, 14, 32);

      // Add timestamp
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 38);

      // Prepare table data
      const tableColumn = [
        "Facility Name",
        "Total Reservations",
        "Total Revenue (LKR)",
      ];
      const tableRows = data.map((item) => [
        item.facilityName,
        item.totalReservations.toString(),
        item.totalRevenue.toLocaleString(),
      ]);

      // Calculate totals
      const totalReservations = data.reduce(
        (sum, item) => sum + item.totalReservations,
        0
      );
      const totalRevenue = data.reduce(
        (sum, item) => sum + item.totalRevenue,
        0
      );

      // Add summary row
      tableRows.push([
        "TOTAL",
        totalReservations.toString(),
        totalRevenue.toLocaleString(),
      ]);

      // Use the imported autoTable with the doc instance
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        footStyles: { fillColor: [220, 220, 220] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        rowPageBreak: "auto",
        theme: "grid",
      });

      // Access the finalY property safely
      const finalY = (doc as any).previousAutoTable?.finalY || 150;

      doc.setFontSize(12);
      doc.text("Summary", 14, finalY + 15);

      doc.setFontSize(10);
      doc.text(`Total Facilities: ${data.length}`, 14, finalY + 25);
      doc.text(`Total Reservations: ${totalReservations}`, 14, finalY + 32);
      doc.text(
        `Total Revenue: LKR ${totalRevenue.toLocaleString()}`,
        14,
        finalY + 39
      );

      // Add footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${pageCount} - NICD Facility Booking System`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      doc.save(`Financial_Report_${startDateStr}_to_${endDateStr}.pdf`);
      
      return true;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return false;
    }
  };
}

export default PDFGenerator;