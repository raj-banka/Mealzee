import { jsPDF } from 'jspdf';

interface InvoiceData {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  orderType: 'meal-plan' | 'individual-dish';
  planTitle?: string;
  planDuration?: string;
  planPrice?: number;
  planOriginalPrice?: number;
  planDiscount?: number;
  dishName?: string;
  dishPrice?: number; 
  quantity?: number;
  startDate?: string;
  orderDate: string;
  preferences?: string;
}

export const generateInvoicePDF = (invoiceData: InvoiceData): void => {
  const doc = new jsPDF();

  // Set font
  doc.setFont('helvetica');

  // Header - Company Info
  doc.setFontSize(20);
  doc.setTextColor(0, 67, 13); // Dark green
  doc.text('MEALZEE', 20, 25);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Delicious Meals Delivered to Your Doorstep', 20, 32);
  doc.text('Bokaro Steel City, Jharkhand', 20, 38);
  doc.text('Phone: +91 9204666105', 20, 44);
  doc.text('Email: mealzeeindia@gmail.com', 20, 50);

  // Invoice Title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', 150, 25);

  // Invoice Details
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoiceData.orderId}`, 150, 35);
  doc.text(`Date: ${new Date(invoiceData.orderDate).toLocaleDateString('en-IN')}`, 150, 42);

  // Line separator
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 60, 190, 60);

  // Customer Information
  doc.setFontSize(12);
  doc.setTextColor(0, 67, 13);
  doc.text('BILL TO:', 20, 75);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Name: ${invoiceData.customerName}`, 20, 85);
  doc.text(`Phone: ${invoiceData.phone}`, 20, 92);

  // Keep address in single line like name and phone
  let yPos = 99;
  doc.text(`Address: ${invoiceData.address}`, 20, yPos);

  // Order Details Section
  yPos = 120; // Fixed position since address is now single line

  doc.setFontSize(12);
  doc.setTextColor(0, 67, 13);
  doc.text('ORDER DETAILS:', 20, yPos);

  // Table Header
  yPos += 15;
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(0, 67, 13);
  doc.rect(20, yPos - 5, 170, 10, 'F');
  doc.text('Description', 25, yPos);
  doc.text('Quantity', 120, yPos);
  doc.text('Amount', 160, yPos);

  // Table Content
  yPos += 15;
  doc.setTextColor(0, 0, 0);

  if (invoiceData.orderType === 'meal-plan') {
    doc.text(invoiceData.planTitle || 'Meal Plan', 25, yPos);
    doc.text(invoiceData.planDuration || '', 25, yPos + 7);
    if (invoiceData.startDate) {
      doc.text(`Start Date: ${new Date(invoiceData.startDate).toLocaleDateString('en-IN')}`, 25, yPos + 14);
    }
    doc.text('1', 125, yPos);
    doc.text(`Rs. ${invoiceData.planPrice || 0}`, 160, yPos);

    if (invoiceData.planOriginalPrice && invoiceData.planDiscount) {
      yPos += 25;
      doc.setTextColor(100, 100, 100);
      doc.text(`Original Price: Rs. ${invoiceData.planOriginalPrice}`, 25, yPos);
      doc.text(`Discount (${invoiceData.planDiscount}%): -Rs. ${invoiceData.planOriginalPrice - (invoiceData.planPrice || 0)}`, 25, yPos + 7);
    }
  } else {
    doc.text(invoiceData.dishName || 'Individual Dish', 25, yPos);
    doc.text(`${invoiceData.quantity || 1}`, 125, yPos);
    doc.text(`Rs. ${(invoiceData.dishPrice || 0) * (invoiceData.quantity || 1)}`, 160, yPos);
  }

  // Total Section
  yPos += 35;
  doc.setLineWidth(0.5);
  doc.line(120, yPos, 190, yPos);

  yPos += 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 67, 13);
  const totalAmount = invoiceData.orderType === 'meal-plan'
    ? invoiceData.planPrice || 0
    : (invoiceData.dishPrice || 0) * (invoiceData.quantity || 1);
  doc.text(`TOTAL: Rs. ${totalAmount}`, 160, yPos);

  // Special Instructions
  if (invoiceData.preferences) {
    yPos += 20;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Special Instructions:', 20, yPos);
    doc.text(invoiceData.preferences, 20, yPos + 7);
  }

  // Footer
  yPos = 260;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for choosing Mealzee!', 20, yPos);
  doc.text('For any queries, contact us at +91 9204666105', 20, yPos + 7);
  doc.text('This is a computer-generated invoice.', 20, yPos + 14);

  // Generate PDF as blob and create download link (same approach as download menu)
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);

  // Create temporary download link
  const link = document.createElement('a');
  link.href = url;
  link.download = `Mealzee_Invoice_${invoiceData.orderId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
};

export const generateInvoiceData = (orderData: any, orderDetails: any, orderType: string): InvoiceData => {
  return {
    orderId: orderData?.orderId || 'N/A',
    customerName: orderDetails.customerName,
    phone: orderDetails.phone,
    address: orderDetails.address,
    orderType: orderType as 'meal-plan' | 'individual-dish',
    planTitle: orderData?.planTitle,
    planDuration: orderData?.planDuration,
    planPrice: orderType === 'meal-plan' ? parseInt(orderData?.planPrice || '0') : undefined,
    planOriginalPrice: orderData?.planOriginalPrice,
    planDiscount: orderData?.planDiscount,
    dishName: orderType === 'individual-dish' ? orderData?.planTitle : undefined, // For individual dishes, name is stored in planTitle
    dishPrice: orderType === 'individual-dish' ? parseInt(orderData?.planPrice || '0') / (orderData?.dishQuantity || 1) : undefined, // Calculate unit price
    quantity: orderType === 'individual-dish' ? (orderData?.dishQuantity || 1) : 1,
    startDate: orderDetails.startDate,
    orderDate: new Date().toISOString(),
    preferences: orderDetails.preferences
  };
};
