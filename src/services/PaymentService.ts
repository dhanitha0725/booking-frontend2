// PaymentService.ts
import axios from 'axios';
//import { ReservationPayload } from '../types/ReservationPayload';
import { PaymentInitiationResponse } from '../types/PaymentInitiationResponse';

interface ReservationRequest {
  startDate: string;
  endDate: string;
  total: number;
  customerType: string;
  items: Array<{
    itemId: number;
    quantity: number;
    type: string;
  }>;
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    organizationName: string;
  };
}

export const createReservation = async (payload: ReservationRequest) => {
  return await axios.post(
    "http://localhost:5162/api/Reservation/createReservation",
    payload
  );
};

export const submitPaymentForm = (paymentData: PaymentInitiationResponse) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentData.actionUrl;

  const fields = {
    merchant_id: paymentData.merchantId,
    return_url: paymentData.returnUrl,
    cancel_url: paymentData.cancelUrl,
    notify_url: paymentData.notifyUrl,
    order_id: paymentData.orderId,
    items: paymentData.items,
    currency: paymentData.currency,
    amount: paymentData.amount,
    first_name: paymentData.firstName,
    last_name: paymentData.lastName,
    email: paymentData.email,
    phone: paymentData.phone,
    address: paymentData.address,
    city: paymentData.city,
    country: paymentData.country,
    hash: paymentData.hash,
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value ? value.toString() : "";
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};