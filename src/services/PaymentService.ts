import axios from 'axios';
import { PaymentInitiationResponse } from '../types/PaymentInitiationResponse';
import { PaymentRequest } from '../types/PaymentTypes';

export const initiatePayment = async (paymentData: PaymentRequest) => {
  try {
    // Ensure we're using the reservation ID that was provided
    if (!paymentData.reservationId) {
      console.error("Missing reservation ID in payment data:", paymentData);
      throw new Error("Missing reservation ID. Cannot process payment without a valid reservation.");
    }
    
    const response = await axios.post(
      "http://localhost:5162/api/Payments/checkout",
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("Payment initiation failed:", error);
    throw error;
  }
};

export const submitPaymentForm = (paymentData: PaymentInitiationResponse) => {
  // Create a form element to submit to PayHere
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentData.actionUrl;

  // PayHere required parameters
  const fields = {
    merchant_id: paymentData.merchantId,
    return_url: paymentData.returnUrl,
    cancel_url: paymentData.cancelUrl,
    notify_url: paymentData.notifyUrl,
    order_id: paymentData.orderId,
    items: paymentData.items,
    currency: paymentData.currency,
    amount: typeof paymentData.amount === 'number' 
      ? paymentData.amount.toFixed(2) 
      : paymentData.amount,
    first_name: paymentData.firstName,
    last_name: paymentData.lastName,
    email: paymentData.email,
    phone: paymentData.phone,
    address: paymentData.address,
    city: paymentData.city,
    country: paymentData.country,
    hash: paymentData.hash,
  };

  // Add all fields to the form
  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value ? value.toString() : "";
    form.appendChild(input);
  });

  // Log for debugging
  console.log("Submitting payment form to:", paymentData.actionUrl);
  console.log("Payment form data:", fields);

  // Add the form to the body and submit it
  document.body.appendChild(form);
  form.submit();
};