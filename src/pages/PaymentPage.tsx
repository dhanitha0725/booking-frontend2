import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const [status, setStatus] = useState("Checking payment status...");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentAndReservation = async () => {
      const orderId = new URLSearchParams(location.search).get("order_id");
      if (!orderId) {
        setStatus("No order ID found.");
        return;
      }

      try {
        // Get payment status
        const paymentStatus = await axios.get(
          `/api/payments/status/${orderId}`
        );

        // Get reservation status
        const reservationStatus = await axios.get(
          `/api/reservations/by-order/${orderId}`
        );

        if (
          paymentStatus.data.status === "success" &&
          reservationStatus.data.status === "confirmed"
        ) {
          setStatus("Payment and reservation confirmed!");
          setPaymentSuccess(true);
          navigate("/confirmation", {
            state: {
              reservation: reservationStatus.data,
              payment: paymentStatus.data,
            },
          });
        } else {
          setStatus("Payment or reservation verification failed.");
          setPaymentSuccess(false);
        }
      } catch (error) {
        console.error("Status check failed:", error);
        setStatus("Error checking status. Please contact support.");
        setPaymentSuccess(false);
      }
    };

    checkPaymentAndReservation();
  }, [location, navigate]);

  return (
    <div>
      <h2>Payment Status</h2>
      <p>{status}</p>
      {!paymentSuccess && (
        <button onClick={() => navigate("/")}>Return Home</button>
      )}
    </div>
  );
};

export default PaymentPage;
