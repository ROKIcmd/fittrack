import { forwardRef, useEffect, useId, useState } from 'react';
import { AlertIcon, CheckIcon, EyeIcon, EyeOffIcon } from '../Icons/Icons';
import './TextField.css';

/**
 * Reusable animated text input (Login, Sign Up, Forgot Password, …).
 *
 * Props
 *  label          Accessible label (visually hidden unless labelVisible)
 *  labelVisible   Show the label above the field
 *  id, name, type, value, onChange, onBlur, onFocus, placeholder
 *  icon           Optional leading icon component, e.g. MailIcon
 *  error          Error message – turns the field red and slides the message in
 *  hint           Helper text shown when there is no error
 *  valid          Shows the "valid" state (green ring, check mark)
 *  required, disabled, autoComplete, inputMode
 *  shakeSignal    Increase this number to play the shake animation
 *  className, style   Customise via props or CSS variables
 *                 (--tf-height, --tf-radius, --tf-bg, --tf-font-size, --tf-gap)
 *  inputProps     Extra attributes forwarded to the <input>
 *  children       Extra content below the field (e.g. <PasswordStrength />)
 *
 * type="password" automatically gets a show/hide toggle.
 * The ref points at the underlying <input>.
 */
const TextField = forwardRef(function TextField(
  {
    label,
    labelVisible = false,
    id,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    icon: LeadingIcon,
    error = '',
    hint = '',
    valid = false,
    required = false,
    disabled = false,
    autoComplete,
    inputMode,
    shakeSignal = 0,
    className = '',
    style,
    inputProps,
    children,
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = `${inputId}-message`;
  const isPassword = type === 'password';

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [last, setLast] = useState({ text: '', isError: false });

  // Start the shake animation whenever the parent bumps shakeSignal.
  useEffect(() => {
    if (shakeSignal > 0) setShaking(true);
  }, [shakeSignal]);

  // Remember the last message so its text stays visible while it collapses.
  const active = error || hint;
  useEffect(() => {
    if (active) setLast({ text: active, isError: Boolean(error) });
  }, [active, error]);
  const shown = active ? { text: active, isError: Boolean(error) } : last;

  const fieldClass = [
    'tf__field',
    error && 'is-invalid',
    !error && valid && 'is-valid',
    disabled && 'is-disabled',
    shaking && 'is-shaking',
  ]
    .filter(Boolean)
    .join(' ');

  function handleAnimationEnd(event) {
    if (event.target === event.currentTarget) setShaking(false);
  }

  return (
    <div className={`tf ${className}`.trim()} style={style}>
      <label htmlFor={inputId} className={labelVisible ? 'tf__label' : 'sr-only'}>
        {label}
      </label>

      <div className={fieldClass} onAnimationEnd={handleAnimationEnd}>
        {LeadingIcon && (
          <>
            <span className="tf__icon">
              <LeadingIcon size={26} />
            </span>
            <span className="tf__divider" aria-hidden="true" />
          </>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          className="tf__input"
          type={isPassword && passwordVisible ? 'text' : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={active ? messageId : undefined}
          {...inputProps}
        />

        {isPassword ? (
          <button
            type="button"
            className="tf__toggle"
            onClick={() => setPasswordVisible((visible) => !visible)}
            onMouseDown={(event) => event.preventDefault()}
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            aria-pressed={passwordVisible}
            disabled={disabled}
          >
            <span className={`tf__eye${passwordVisible ? ' is-visible' : ''}`}>
              <EyeIcon className="tf__eye-on" size={24} />
              <EyeOffIcon className="tf__eye-off" size={24} />
            </span>
          </button>
        ) : (
          valid &&
          !error && (
            <span className="tf__status" aria-hidden="true">
              <CheckIcon size={22} strokeWidth={2.5} />
            </span>
          )
        )}
      </div>

      <div className={`tf__message${active ? ' is-open' : ''}`} aria-live="polite">
        <div className="tf__message-inner" aria-hidden={!active}>
          <p id={messageId} className={`tf__text${shown.isError ? ' is-error' : ''}`}>
            {shown.isError && <AlertIcon className="tf__text-icon" size={16} />}
            <span>{shown.text}</span>
          </p>
        </div>
      </div>

      {children}
    </div>
  );
});

export default TextField;
