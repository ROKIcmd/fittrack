import './Logo.css';

/**
 * FitTrack logo: emblem + wordmark.
 *
 * Props
 *  scale       Number, 1 = Figma size (emblem box 70px, wordmark 34px)
 *  emblemSrc   Path to the exported emblem SVG (see README)
 *  name        Wordmark text
 *  className, style
 */
export default function Logo({
  scale = 1,
  emblemSrc = '/assets/fittrack-emblem.svg',
  name = 'FitTrack',
  className = '',
  style,
}) {
  return (
    <div className={`logo ${className}`.trim()} style={{ '--logo-scale': scale, ...style }}>
      <span className="logo__mark">
        <img className="logo__emblem" src={emblemSrc} alt="" />
      </span>
      <span className="logo__text">{name}</span>
    </div>
  );
}
