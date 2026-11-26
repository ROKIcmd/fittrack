import { forwardRef, useEffect, useId, useState } from 'react';
import { AlertIcon, ChevronDownIcon } from '../Icons/Icons';
import '../TextField/TextField.css';
import './Select.css';

/**
 * Dropdown that looks and behaves like <TextField> (same pill, focus ring,
 * valid/invalid states, shake and animated error message). It wraps a native
 * <select>, so it is keyboard- and screen-reader-friendly and uses the
 * platform picker on phones.
 *
 * Props
 *  label, labelVisible, id, name, value, onChange, onBlur
 *  options        [{ value, label }, …] or plain strings
 *  placeholder    Greyed first option shown while nothing is chosen
 *  error, hint, valid, required, disabled, shakeSignal, className, style
 *
 * Style with the same CSS variables as TextField (--tf-height, --tf-radius,
 * --tf-padding-left, --tf-label-*, …). The ref points at the <select>.
 */
const Select = forwardRef(function Select(
  {
    label,
    labelVisible = false,
    id,
    name,
    value,
    onChange,
    onBlur,
    options = [],
    placeholder = 'Select…',
    error = '',
    hint = '',
    valid = false,
    required = false,
    disabled = false,
    shakeSignal = 0,
    className = '',
    style,
  },
  ref,
) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const messageId = `${selectId}-message`;

  const [shaking, setShaking] = useState(false);
  const [last, setLast] = useState({ text: '', isError: false });

  useEffect(() => {
    if (shakeSignal > 0) setShaking(true);
  }, [shakeSignal]);

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

  const normalised = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );

  return (
    <div className={`tf ${className}`.trim()} style={style}>
      <label htmlFor={selectId} className={labelVisible ? 'tf__label' : 'sr-only'}>
        {label}
      </label>

      <div className={fieldClass} onAnimationEnd={handleAnimationEnd}>
        <select
          ref={ref}
          id={selectId}
          name={name}
          className={`tf__input tf__select${value === '' ? ' is-placeholder' : ''}`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={active ? messageId : undefined}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {normalised.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="tf__chevron" aria-hidden="true">
          <ChevronDownIcon size={18} />
        </span>
      </div>

      <div className={`tf__message${active ? ' is-open' : ''}`} aria-live="polite">
        <div className="tf__message-inner" aria-hidden={!active}>
          <p id={messageId} className={`tf__text${shown.isError ? ' is-error' : ''}`}>
            {shown.isError && <AlertIcon className="tf__text-icon" size={16} />}
            <span>{shown.text}</span>
          </p>
        </div>
      </div>
    </div>
  );
});

export default Select;
