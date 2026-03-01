/**
 * Utility for converting product units like Volume (ltr <-> ml) and Weight (kg <-> gm).
 * Matches the backend implementation to ensure variant sizes are correctly validated.
 * 
 * @param {number} amount - The numeric value to convert
 * @param {string} fromUnit - The unit of the `amount` (e.g., 'kg')
 * @param {string} toUnit - The target unit to convert into (e.g., 'gm')
 * @returns {number} The converted amount
 */
export function convertToBaseUnit(amount: number, fromUnit: string, toUnit: string): number {
  if (!fromUnit || !toUnit) return amount;
  
  const from = fromUnit.toLowerCase().trim();
  const to = toUnit.toLowerCase().trim();
  
  if (from === to) return amount;

  // Volume conversions
  if (from === 'ltr' && to === 'ml') return amount * 1000;
  if (from === 'ml' && to === 'ltr') return amount / 1000;
  
  // Weight conversions
  if (from === 'kg' && to === 'gm') return amount * 1000;
  if (from === 'gm' && to === 'kg') return amount / 1000;

  // Fallback if units are incompatible
  return amount;
}
