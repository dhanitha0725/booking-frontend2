/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { FinancialReportItem, ReservationReportItem } from "../types/report";

// Add new interface for Invoice
interface Invoice {
  invoiceID: number;
  amountPaid: number;
  amountDue: number;
  issuedDate: string;
  reservationID: number;
  paymentID: string;
  paymentMethod: string;
  paymentStatus: string;
  facilityName?: string;
  customerName?: string;
  customerEmail?: string;
  reservationStatus?: string;
  reservationStartDate?: string;
  reservationEndDate?: string;
  totalAmount?: number;
}

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
        "Total Revenue (Rs.)",
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
        `Total Revenue: Rs. ${totalRevenue.toLocaleString()}`,
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

  // Add new method for reservation reports
  static generateReservationReport = (
    data: ReservationReportItem[],
    startDateStr: string,
    endDateStr: string
  ) => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      if (typeof autoTable !== 'function') {
        console.error('jsPDF-AutoTable plugin is not properly loaded');
        return false;
      }

      // Add title
      doc.setFontSize(18);
      doc.text("Reservation Report", 14, 22);

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
        "Completed Reservations"
      ];
      const tableRows = data.map((item) => {
        return [
          item.facilityName,
          item.totalReservations.toString(),
          item.totalCompletedReservations.toString()
        ];
      });

      // Calculate totals
      const totalReservations = data.reduce(
        (sum, item) => sum + item.totalReservations, 0
      );
      const totalCompletedReservations = data.reduce(
        (sum, item) => sum + item.totalCompletedReservations, 0
      );

      // Add summary row 
      tableRows.push([
        "TOTAL",
        totalReservations.toString(),
        totalCompletedReservations.toString()
      ]);

      // Generate the table
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
      doc.text(`Completed Reservations: ${totalCompletedReservations}`, 14, finalY + 39);
      // Removed completion rate line from summary

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
      doc.save(`Reservation_Report_${startDateStr}_to_${endDateStr}.pdf`);
      
      return true;
    } catch (error) {
      console.error("Error generating reservation PDF:", error);
      return false;
    }
  };

  // New method for generating invoice PDF
  static generateInvoicePDF = (invoice: Invoice) => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      if (typeof autoTable !== 'function') {
        console.error('jsPDF-AutoTable plugin is not properly loaded');
        return false;
      }

      // Format the invoice number
      const formattedInvoiceNumber = `INV-${invoice.invoiceID}-${new Date().getFullYear()}`;
      
      // Format the date
      const formattedDate = new Date(invoice.issuedDate).toLocaleDateString();
      
      // Format reservation dates if available
      const formattedStartDate = invoice.reservationStartDate 
        ? new Date(invoice.reservationStartDate).toLocaleDateString() 
        : "N/A";
      const formattedEndDate = invoice.reservationEndDate
        ? new Date(invoice.reservationEndDate).toLocaleDateString()
        : "N/A";
      
      // Calculate total amount
      const totalAmount = invoice.totalAmount || (invoice.amountPaid + invoice.amountDue);

      // Add company logo and header
      doc.setFontSize(20);
      doc.text("NICD Facility Booking System", 105, 20, { align: "center" });
      
      // Add Invoice title
      doc.setFontSize(18);
      doc.text("INVOICE", 105, 30, { align: "center" });
      
      // Add horizontal line
      doc.setLineWidth(0.5);
      doc.line(14, 35, 196, 35);

      // Add invoice details section
      doc.setFontSize(12);
      doc.text("Invoice Details", 14, 45);
      
      // Left column - Invoice info
      doc.setFontSize(10);
      doc.text(`Invoice Number: ${formattedInvoiceNumber}`, 14, 55);
      doc.text(`Date Issued: ${formattedDate}`, 14, 62);
      doc.text(`Payment Method: ${invoice.paymentMethod}`, 14, 69);
      doc.text(`Payment Status: ${invoice.paymentStatus}`, 14, 76);
      
      // Right column - Reservation info
      doc.text(`Reservation ID: ${invoice.reservationID}`, 120, 55);
      doc.text(`Payment ID: ${invoice.paymentID}`, 120, 62);
      
      // Add facility and customer information
      if (invoice.facilityName) {
        doc.text(`Facility: ${invoice.facilityName}`, 120, 69);
      }
      
      if (invoice.reservationStatus) {
        doc.text(`Reservation Status: ${invoice.reservationStatus}`, 120, 76);
      }
      
      // Add horizontal line
      doc.line(14, 85, 196, 85);
      
      let currentY = 95;
      
      // Add customer details section if available
      if (invoice.customerName || invoice.customerEmail) {
        doc.setFontSize(12);
        doc.text("Customer Details", 14, currentY);
        currentY += 10;
        
        doc.setFontSize(10);
        if (invoice.customerName) {
          doc.text(`Name: ${invoice.customerName}`, 14, currentY);
          currentY += 7;
        }
        
        if (invoice.customerEmail) {
          doc.text(`Email: ${invoice.customerEmail}`, 14, currentY);
          currentY += 7;
        }
        
        // Add reservation dates if available
        if (invoice.reservationStartDate && invoice.reservationEndDate) {
          doc.text(`Reservation Period: ${formattedStartDate} to ${formattedEndDate}`, 14, currentY);
          currentY += 7;
        }
        
        // Add horizontal line
        currentY += 6;
        doc.line(14, currentY, 196, currentY);
        currentY += 10;
      }
      
      // Add payment details
      doc.setFontSize(12);
      doc.text("Payment Details", 14, currentY);
      currentY += 10;
      
      // Create the payment details table
      autoTable(doc, {
        startY: currentY,
        head: [["Description", "Amount (Rs.)"]],
        body: [
          ["Amount Paid", invoice.amountPaid.toFixed(2)],
          ["Amount Due", invoice.amountDue.toFixed(2)],
          ["Total Amount", totalAmount.toFixed(2)]
        ],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        theme: "grid",
        margin: { left: 14, right: 14 },
        tableWidth: 'auto'
      });

      const finalY = (doc as any).previousAutoTable?.finalY || (currentY + 40);

      // thank you message
      doc.setFontSize(10);
      doc.text("Thank you for your booking!", 105, finalY + 15, { align: "center" });

      // Add footer
      doc.setFontSize(8);
      doc.text(
        "NICD Facility Booking System - Contact: support@nicd.com",
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );

      // Save the PDF
      doc.save(`Invoice_${formattedInvoiceNumber}.pdf`);
      
      return true;
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
      return false;
    }
  };
}

export default PDFGenerator;