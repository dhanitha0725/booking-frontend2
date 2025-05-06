import { useState, useEffect } from "react";
import { FullReservationDetails } from "../types/ReservationDetails";
import api from "../services/api";
import { AxiosError } from "axios";

/**
 * Custom hook for fetching reservation details
 * 
 * This handles the complete lifecycle of reservation data fetching,
 * (loading states, error handling, and data fetching)
 * 
 * @param reservationId - parameter for the api
 * @param open - dialog open state
 * @returns Object containing reservation data, loading state, and error state
 */
const useReservationDetails = (
  reservationId: number | undefined,
  open: boolean
) => {
  const [reservation, setReservation] = useState<FullReservationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when component is not visible or no ID is provided
    if (!open || !reservationId) {
      setReservation(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchReservationDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get authentication token
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token not found");
        
        // Fetch reservation data
        const response = await api.get(
          `/Reservation/reservation-details/${reservationId}`
        );
        
        // Transform response data to match our interface
        const responseData = response.data;
        const reservationData: FullReservationDetails = {
          ...responseData,
          // Handle property name differences between API and frontend model (fixer: || responseData.user)
          user: responseData.reservationUser,
        };
        
        setReservation(reservationData);
      } catch (err) {
        // Handle errors with appropriate error messages
        const axiosError = err as AxiosError<{ message: string }>;
        setError(
          axiosError.response?.data?.message ||
            "Failed to find reservation details"
        );
        console.error("Error fetching reservation details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [open, reservationId]);

  return { reservation, loading, error };
};

export default useReservationDetails;