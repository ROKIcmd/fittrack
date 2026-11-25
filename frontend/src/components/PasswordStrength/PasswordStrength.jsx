import { getPasswordStrength } from '../../utils/validators';
import './PasswordStrength.css';

/**
 * Four-segment password strength meter. Slides open as soon as the user types.
 * Intended to be passed as `children` of a password <TextField>.
 */
export default function PasswordStrength({ password = '' }) {
  const { score, label } = getPasswordStrength(password);
  const open = password.length > 0;

  return (
    <div className={`pws${open ? ' is-open' : ''}`} data-level={score}>
      <div className="pws__inner" aria-hidden={!open}>
        <div className="pws__row">
          <div className="pws__bars" aria-hidden="true">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={`pws__bar${score >= n ? ' is-filled' : ''}`} />
            ))}
          </div>
          <span className="pws__label" role="status">
            {open ? `Strength: ${label}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
