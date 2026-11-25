import { CheckIcon, SpinnerIcon } from '../Icons/Icons';
import './Button.css';

/**
 * Reusable button.
 *
 * Props
 *  variant     'primary' (default) | 'secondary' | 'ghost'
 *  type        'button' (default) | 'submit' | 'reset'
 *  loading     Shows a spinner, keeps the width, ignores clicks
 *  success     Turns green with a check mark
 *  disabled    Native disabled state
 *  icon        Optional icon component shown before the label
 *  fullWidth   Stretch to the container
 *  width, height   Number (px) or any CSS length; override the Figma size
 *  className, style, onClick, …rest forwarded to <button>
 *
 * While loading we use aria-disabled (not `disabled`) so keyboard focus is
 * not lost, and we block the click ourselves.
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  success = false,
  disabled = false,
  icon: Icon,
  fullWidth = false,
  width,
  height,
  className = '',
  style,
  onClick,
  ...rest
}) {
  const toLength = (value) => (typeof value === 'number' ? `${value}px` : value);
  const sizeStyle = {
    ...(width !== undefined && { '--btn-width': toLength(width) }),
    ...(height !== undefined && { '--btn-height': toLength(height) }),
    ...style,
  };

  const classes = [
    'btn',
    `btn--${variant}`,
    fullWidth && 'btn--full',
    loading && 'is-loading',
    success && !loading && 'is-success',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  function handleClick(event) {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      type={type}
      className={classes}
      style={sizeStyle}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      <span className="btn__content">
        {success && !loading ? (
          <CheckIcon className="btn__icon" size={22} strokeWidth={3} />
        ) : (
          Icon && <Icon className="btn__icon" size={22} />
        )}
        <span className="btn__label">{children}</span>
      </span>

      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <SpinnerIcon size={26} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}
