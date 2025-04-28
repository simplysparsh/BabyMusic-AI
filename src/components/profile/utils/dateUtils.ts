import type { AgeGroup } from '../../../types'; // Adjust path as needed

export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = new Date().getMonth() + 1;

// Calculate years for dropdown (current year down to 5 years ago)
export const YEARS = Array.from(
  { length: 6 },
  (_, i) => CURRENT_YEAR - i
);

// Add "Older" option for future expansion
export const AGE_OPTIONS = [
  ...YEARS.map(year => ({ value: year, label: year.toString() })),
  { value: CURRENT_YEAR - 6, label: 'Older' } // Consider edge cases for this value
];

// Optional: Move getAgeGroup here too if not used elsewhere
export const getAgeGroup = (month: number, year: number): AgeGroup => {
  const ageInMonths = ((CURRENT_YEAR - year) * 12) + (CURRENT_MONTH - month);
  if (ageInMonths < 0) return '0-6'; // Handle future dates gracefully if needed
  if (ageInMonths <= 6) return '0-6';
  if (ageInMonths <= 12) return '7-12';
  return '13-24'; // Assuming this is the max defined age group
}; 