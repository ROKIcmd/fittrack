import { useEffect, useState } from 'react';
import './QrPanel.css';

/**
 * Rounded white panel that shows a payment QR code image.
 * If there is no `src` (or it fails to load) a clear placeholder is shown
 * instead of a broken image. Reusable on the Payment screen too.
 *
 * Props: src, alt, size (number px or CSS length, Figma = 156), className, style
 */
export default function QrPanel({
  src,
  alt = 'Payment QR code',
  size = 156,
  className = '',
  style,
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const cssSize = typeof size === 'number' ? `${size}px` : size;
  const showImage = Boolean(src) && !failed;

  return (
    <div className={`qr ${className}`.trim()} style={{ '--qr-size': cssSize, ...style }}>
      {showImage ? (
        <img className="qr__img" src={src} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <div className="qr__empty" role="img" aria-label="QR code not available yet">
          <span>QR code will appear here</span>
        </div>
      )}
    </div>
  );
}
