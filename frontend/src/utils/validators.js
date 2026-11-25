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
