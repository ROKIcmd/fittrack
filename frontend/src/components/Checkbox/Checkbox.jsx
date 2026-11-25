import { forwardRef, useEffect, useId, useState } from 'react';
import { AlertIcon } from '../Icons/Icons';
import './Checkbox.css';

/**
 * Reusable animated checkbox with an optional error message.
 *
 * Props: label, id, name, checked, onChange, onBlur, error, required,
 *        disabled, shakeSignal (bump to shake), className, style.
 * The ref points at the underlying <input type="checkbox">.
 */
const Checkbox = forwardRef(function Checkbox(
  {
    label,
    id,
    name,
    checked,
    onChange,
    onBlur,
    error = '',
    required = false,
    disabled = false,
    shakeSignal = 0,
    className = '',
    style,
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = `${inputId}-message`;

  const [shaking, setShaking] = useState(false);
  const [lastError, setLastError] = useState('');

  useEffect(() => {
    if (shakeSignal > 0) setShaking(true);
  }, [shakeSignal]);

  useEffect(() => {
    if (error) setLastError(error);
  }, [error]);

  function handleAnimationEnd(event) {
    if (event.target === event.currentTarget) setShaking(false);
  }

  return (
    <div className={`cb${error ? ' is-invalid' : ''} ${className}`.trim()} style={style}>
      <label
        className={`cb__label${shaking ? ' is-shaking' : ''}${disabled ? ' is-disabled' : ''}`}
        htmlFor={inputId}
        onAnimationEnd={handleAnimationEnd}
      >
        <input
          ref={ref}
          id={inputId}
          name={name}
          className="cb__input"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? messageId : undefined}
        />
        <span className="cb__box" aria-hidden="true">
          <svg className="cb__check" viewBox="0 0 14 12">
            <path d="M3 6.4 5.8 9 11 3.4" pathLength="1" />
          </svg>
        </span>
        <span className="cb__text">{label}</span>
      </label>

      <div className={`cb__message${error ? ' is-open' : ''}`} aria-live="polite">
        <div className="cb__message-inner" aria-hidden={!error}>
          <p id={messageId} className="cb__error">
            <AlertIcon size={16} />
            <span>{error || lastError}</span>
          </p>
        </div>
      </div>
    </div>
  );
});

export default Checkbox;
