// ValidationUtils.ts
import { ValidationResult } from '../types/PaymentTypes';

export const validateItems = (items: Array<{ itemId: number; quantity: number; type: string }>): ValidationResult => {
  const invalidItems = items.filter(
    item => !(item.itemId > 0 && item.quantity > 0 && item.type.trim() !== "")
  );
  
  return {
    isValid: invalidItems.length === 0,
    invalidItems: invalidItems.length > 0 ? invalidItems : undefined
  };
};