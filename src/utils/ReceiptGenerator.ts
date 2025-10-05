import { jsPDF } from "jspdf";

export interface ReceiptData {
  reservationId?: number | string;
  orderId?: string;
  amount?: number;
  facilityName?: string;
  customerName?: string;
  customerEmail?: string;
  items?: string; // summary of booked items
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  // Added fields
  totalAmount?: number;   // total reservation amount
  amountPaid?: number;    // amount actually paid (if different)
  paymentPage?: string;   // e.g., "PayHere", "Bank Transfer"
}

/**
 * Generate and save a receipt PDF using jsPDF.
 */
export const generateReceiptPDF = (data: ReceiptData) => {
  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const left = 40;
    let y = 50;

    // Header
    doc.setFontSize(18);
    doc.text("NICD Facility Booking", 297.5, y, { align: "center" });
    y += 28;

    doc.setLineWidth(0.5);
    doc.line(left, y, 595 - left, y);
    y += 20;

    // Receipt title + meta
    doc.setFontSize(14);
    doc.text("Payment Receipt", left, y);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 595 - left, y, { align: "right" });
    y += 22;

    // Reservation & payment identifiers
    doc.setFontSize(11);
    if (data.reservationId !== undefined) {
      doc.text(`Reservation ID: ${data.reservationId}`, left, y);
    }
    if (data.orderId) {
      doc.text(`Order ID: ${data.orderId}`, 595 - left, y, { align: "right" });
    }
    y += 18;

    doc.setLineWidth(0.25);
    doc.line(left, y, 595 - left, y);
    y += 16;

    // Customer & Facility details block
    doc.setFontSize(11);
    if (data.customerName || data.customerEmail) {
      doc.text("Customer:", left, y);
      if (data.customerName) {
        doc.text(`Name: ${data.customerName}`, left + 14, y += 16);
      }
      if (data.customerEmail) {
        doc.text(`Email: ${data.customerEmail}`, left + 14, y += 16);
      }
      y += 8;
    }

    if (data.facilityName) {
      doc.text(`Facility: ${data.facilityName}`, left, y);
      y += 18;
    }

    // Reservation period / items
    if (data.startDate || data.endDate || data.items) {
      doc.text("Booking Details:", left, y);
      if (data.startDate) {
        doc.text(`Start: ${data.startDate}`, left + 14, y += 16);
      }
      if (data.endDate) {
        doc.text(`End: ${data.endDate}`, left + 14, y += 16);
      }
      if (data.items) {
        y += 4;
        doc.text("Items:", left + 14, y += 16);
        // wrap long items text
        const maxWidth = 595 - left * 2 - 20;
        const lines = doc.splitTextToSize(data.items, maxWidth);
        doc.text(lines, left + 28, y);
        y += lines.length * 12;
      } else {
        y += 8;
      }
      y += 8;
    }

    // Payment details
    doc.setLineWidth(0.25);
    doc.line(left, y, 595 - left, y);
    y += 12;

    doc.setFontSize(11);
    doc.text("Payment Details:", left, y);
    if (data.paymentMethod) {
      doc.text(`Method: ${data.paymentMethod}`, left + 14, y += 16);
    }
    if (data.paymentPage) {
      doc.text(`Payment Page: ${data.paymentPage}`, left + 14, y += 16);
    }
    if (data.paymentStatus) {
      doc.text(`Status: ${data.paymentStatus}`, left + 14, y += 16);
    }
    // Show amount paid and total reservation amount (if provided)
    const paid = data.amountPaid ?? data.amount;
    if (typeof paid === "number") {
      doc.setFontSize(12);
      doc.text(`Amount Paid: Rs. ${Number(paid).toFixed(2)}`, 595 - left, y, { align: "right" });
      y += 16;
    }

    if (typeof data.totalAmount === "number") {
      doc.setFontSize(12);
      doc.text(`Total Amount: Rs. ${Number(data.totalAmount).toFixed(2)}`, 595 - left, y, { align: "right" });
      y += 18;
    } else {
      y += 12;
    }

    // Footer / thank you
    y += 8;
    doc.setLineWidth(0.5);
    doc.line(left, y, 595 - left, y);
    y += 18;
    doc.setFontSize(10);
    doc.text("Thank you for your booking!", 297.5, y, { align: "center" });
    y += 16;
    doc.text("Contact: support@nicd.com", 297.5, y, { align: "center" });

    // Save
    const fileName = `Receipt_${data.reservationId ?? data.orderId ?? Date.now()}.pdf`;
    doc.save(fileName);
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error generating receipt PDF:", err);
    return false;
  }
};

export default { generateReceiptPDF };