/**
 * Small, dependency-free validators. Each returns an error message string,
 * or an empty string when the value is valid. Reuse them in Login, Forgot
 * Password, etc.
 */

export const PASSWORD_MIN_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return 'Please enter your email address.';
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email, like name@example.com.';
  return '';
}

export function validatePassword(value) {
  if (!value) return 'Please enter a password.';
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return 'Include at least one letter and one number.';
  }
  return '';
}

export function validateConfirmPassword(value, password) {
  if (!value) return 'Please re-enter your password.';
  if (value !== password) return "Passwords don't match.";
  return '';
}

/* ---- Registration details validators ------------------------------------------- */

export function validateFullName(value) {
  const name = value.trim();
  if (!name) return 'Please enter your full name.';
  if (name.length < 2) return 'That name looks too short.';
  return '';
}

/** Age in whole years from a "YYYY-MM-DD" string, or '' if it can't be read. */
export function getAge(dateString, today = new Date()) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return '';

  let age = today.getFullYear() - year;
  const currentMonth = today.getMonth() + 1;
  const hadBirthday = currentMonth > month || (currentMonth === month && today.getDate() >= day);
  if (!hadBirthday) age -= 1;
  return age;
}

export function validateBirthDate(value, today = new Date()) {
  if (!value) return 'Please choose your date of birth.';
  const age = getAge(value, today);
  if (age === '') return 'Enter a valid date.';
  if (age < 0) return "Date of birth can't be in the future.";
  if (age > 120) return 'Please check the year of birth.';
  return '';
}

export function validateRequiredChoice(value, message = 'Please choose an option.') {
  return value ? '' : message;
}

export function validateRequiredText(value, message = 'This field is required.') {
  return value.trim() ? '' : message;
}

/** Optional field: empty is fine, a filled value must be a sensible weight. */
export function validateWeightKg(value) {
  if (value === '') return '';
  const kg = Number(value);
  if (!Number.isFinite(kg) || kg < 20 || kg > 400) return 'Enter a weight between 20 and 400 kg.';
  return '';
}

/** Optional field: height is entered in metres, e.g. 1.75. */
export function validateHeightM(value) {
  if (value === '') return '';
  const metres = Number(value);
  if (!Number.isFinite(metres) || metres < 0.5 || metres > 2.5) {
    return 'Enter your height in metres, like 1.75.';
  }
  return '';
}

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

/**
 * Scores a password from 0–4 using four simple checks:
 * length ≥ 8, upper + lower case, a number, and a symbol (or length ≥ 12).
 */
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '' };

  const checks = [
    password.length >= PASSWORD_MIN_LENGTH,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password) || password.length >= 12,
  ];
  const score = checks.filter(Boolean).length;
  return { score, label: STRENGTH_LABELS[score] };
}
