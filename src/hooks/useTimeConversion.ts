/**
 * Custom hook for time conversion utilities
 * 
 * Provides functions to convert between different time formats
 */
export const useTimeConversion = () => {
  /**
   * Converts a timespan string (HH:MM) to a human-readable format
   * @param timeSpan - Time in HH:MM format
   * @returns Human-readable time string (e.g., "2 days 3 hours")
   */
  const convertTimeSpanToString = (timeSpan: string) => {
    const [hours, minutes] = timeSpan.split(":").map(Number);
    
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days} day${days > 1 ? "s" : ""}${
        remainingHours > 0
          ? ` ${remainingHours} hour${remainingHours > 1 ? "s" : ""}`
          : ""
      }`;
    }
    
    const hourString = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
    const minuteString = minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : "";
    
    return [hourString, minuteString].filter(Boolean).join(" ");
  };

  /**
   * Extracts and returns the hours from a timespan string
   * @param timeSpan - Time in HH:MM format
   * @returns Number of hours
   */
  const convertHoursToNumbers = (timeSpan: string) => {
    const [hours] = timeSpan.split(":");
    return parseInt(hours, 10);
  };

  return {
    convertTimeSpanToString,
    convertHoursToNumbers,
  };
};