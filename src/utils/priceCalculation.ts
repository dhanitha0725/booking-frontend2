import { CustomerType } from "../types/employeeReservation";

export const getItemPrice = (
  item: any, 
  itemType: "package" | "room",
  customerType: CustomerType
): number => {
  if (itemType === "package") {
    const pricing = item.pricing?.find(
      (p: any) => p.sector === customerType.toLowerCase()
    );
    return pricing?.price || 0;
  } else {
    const pricing = item.roomPricing?.find(
      (p: any) => p.sector === customerType.toLowerCase()
    );
    return pricing?.price || 0;
  }
};

export const recalculateItemPrices = (items: any[], facilityData: any, customerType: CustomerType) => {
  return items.map((item) => {
    let updatedPrice = 0;

    if (item.type === "package") {
      const packageData = facilityData.packages?.find(
        (p: any) => p.packageId === item.itemId
      );
      if (packageData) {
        updatedPrice = getItemPrice(packageData, "package", customerType);
      }
    } else { // room
      const roomData = facilityData.rooms?.find(
        (r: any) => r.roomTypeId === item.itemId
      );
      if (roomData) {
        updatedPrice = getItemPrice(roomData, "room", customerType);
      }
    }

    return { ...item, price: updatedPrice };
  });
};