import { useState } from 'react';
import './TrainerDetails.css';

/**
 * Trainer Details page  →  route: /trainer/details
 * Design reference: Figma frame "Trauner profile" (48:66), 1279 × 769.
 *
 * Self-contained on purpose: everything this page needs (sidebar, top bar,
 * icons, styles) lives in this folder, and every CSS class starts with
 * "trdt" so nothing can collide with your other pages. Copy the folder in,
 * add the route, done.
 *
 *   import TrainerDetails from './pages/TrainerDetails/TrainerDetails.jsx';
 *   <Route path="/trainer/details" element={<TrainerDetails />} />
 *
 * Every prop is optional. Without props it shows the Figma placeholder text.
 *
 *  trainer         { firstName, lastName, education, specialization,
 *                    experience, clients, message }   (all strings)
 *  photoSrc        trainer photo           (default /assets/trainer-photo.png)
 *  backgroundSrc   page background photo   (default /assets/trainer-bg.png)
 *  memberName      name in the top-right pill     (default "Dela Cruz, Juan")
 *  welcomeName     name in "Welcome, …!"          (default "Juan")
 *  routes          override any sidebar link, e.g. { dashboard: '/member' }
 *  onNavigate      (path) => void. Pass your router's navigate() for
 *                  client-side navigation; without it links are normal <a href>
 *  onLogout        () => void. Pass the logout from your AuthProvider
 *  onViewSchedule  () => void. Called by the "View Schedule" button
 */

const DEFAULT_TRAINER = {
  firstName: '[First Name]',
  lastName: '[Last Name]',
  education: 'Bachelor in PE graduate',
  specialization: 'Strength training',
  experience: '4 years | Gym Trainer',
  clients: '5 clients',
  message: 'Consistency is the key',
};

// Edit these (or pass the `routes` prop) to match your router.
const DEFAULT_ROUTES = {
  dashboard: '/dashboard',
  membership: '/membership',
  trainer: '/trainer/details',
  workoutPlan: '/workout-plan',
  workoutLog: '/workout-log',
  progress: '/progress',
  profile: '/profile',
  logout: '/',
};

/* ---- Icons (inline so the page has no icon dependency) ------------------ */

function Svg({ children, size = 21, fill = 'none', strokeWidth = 1.7, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function TrainerGlyph({ size }) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3.2" />
      <path d="M5.9 19.3c1.4-2.5 3.5-3.8 6.1-3.8s4.7 1.3 6.1 3.8" />
    </Svg>
  );
}

const ICONS = {
  dashboard: (
    <Svg>
      <path d="M3 11.2 12 3.8l9 7.4V20a1 1 0 0 1-1 1h-5v-6.2H9V21H4a1 1 0 0 1-1-1z" />
    </Svg>
  ),
  membership: (
    <Svg fill="currentColor" strokeWidth={1}>
      <path d="M12 2c.7 5.4 4.6 9.3 10 10-5.4.7-9.3 4.6-10 10-.7-5.4-4.6-9.3-10-10 5.4-.7 9.3-4.6 10-10z" />
    </Svg>
  ),
  trainer: <TrainerGlyph />,
  workoutPlan: (
    <Svg>
      <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9.2v5.6M20.5 9.2v5.6M6.5 12h11" />
    </Svg>
  ),
  workoutLog: (
    <Svg>
      <rect x="5" y="3.5" width="14" height="18" rx="2.2" />
      <path d="M9 3.5V2h6v1.5M9 10h6M9 14h6M9 18h3" />
    </Svg>
  ),
  progress: (
    <Svg>
      <path d="M3 3v18h18M7 15.5l4-5 3 3 6-7" />
    </Svg>
  ),
  profile: (
    <Svg>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M10.3 2.6h3.4l.5 2.4a7.6 7.6 0 0 1 1.9 1.1l2.3-.8 1.7 3-1.8 1.6a7.7 7.7 0 0 1 0 2.2l1.8 1.6-1.7 3-2.3-.8a7.6 7.6 0 0 1-1.9 1.1l-.5 2.4h-3.4l-.5-2.4a7.6 7.6 0 0 1-1.9-1.1l-2.3.8-1.7-3 1.8-1.6a7.7 7.7 0 0 1 0-2.2L3.9 9.2l1.7-3 2.3.8a7.6 7.6 0 0 1 1.9-1.1z" />
    </Svg>
  ),
  logout: (
    <Svg size={20}>
      <path d="M9.5 3H5a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h4.5M15.5 8l4 4-4 4M19.5 12H9.5" />
    </Svg>
  ),
};

function BellIcon() {
  return (
    <svg width="34" height="35" viewBox="0 0 34 35" aria-hidden="true" focusable="false">
      <path
        fill="#fff"
        d="M14.5 6.2C9.9 7.2 7 11 7 15.6v5.2L4.4 25v1.8h24.2V25l-2.6-4.2v-4.2M12.6 29.4a4.4 4.4 0 0 0 8.8 0z"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="8.5" r="5.4" fill="#fff" stroke="#1f2937" strokeWidth="2.4" />
    </svg>
  );
}

/* ---- Sidebar ------------------------------------------------------------- */

const NAV = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'membership', label: 'Membership' },
  { key: 'trainer', label: 'Trainer' },
  { key: 'workoutPlan', label: 'Workout Plan' },
  { key: 'workoutLog', label: 'Workout Log' },
  { key: 'progress', label: 'Progress' },
  { key: 'profile', label: 'Profile' },
];

function isPlainLeftClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

/* ---- Page ---------------------------------------------------------------- */

export default function TrainerDetails({
  trainer,
  photoSrc = '/assets/trainer-photo.png',
  backgroundSrc = '/assets/trainer-bg.png',
  memberName = 'Dela Cruz, Juan',
  welcomeName = 'Juan',
  routes,
  onNavigate,
  onLogout,
  onViewSchedule,
}) {
  const info = { ...DEFAULT_TRAINER, ...trainer };
  const paths = { ...DEFAULT_ROUTES, ...routes };
  const fullName = `${info.lastName}, ${info.firstName}`;

  const [photoFailed, setPhotoFailed] = useState(false);
  const [backgroundFailed, setBackgroundFailed] = useState(false);
  const [emblemFailed, setEmblemFailed] = useState(false);

  function go(event, path) {
    if (onNavigate && isPlainLeftClick(event)) {
      event.preventDefault();
      onNavigate(path);
    }
  }

  function handleLogout(event) {
    if (onLogout && isPlainLeftClick(event)) {
      event.preventDefault();
      onLogout();
    } else {
      go(event, paths.logout);
    }
  }

  return (
    <div className="trdt">
      {/* Background photo + dark veil */}
      <div className="trdt__bg" aria-hidden="true">
        {!backgroundFailed && (
          <img
            className="trdt__bg-img"
            src={backgroundSrc}
            alt=""
            onError={() => setBackgroundFailed(true)}
          />
        )}
        <div className="trdt__veil" />
      </div>

      {/* Sidebar */}
      <aside className="trdt__side trdt-reveal" style={{ '--trdt-delay': '0ms' }}>
        <div className="trdt__brand">
          {!emblemFailed && (
            <img
              className="trdt__emblem"
              src="/assets/fittrack-emblem.svg"
              alt=""
              onError={() => setEmblemFailed(true)}
            />
          )}
          <span className="trdt__brand-name">FitTrack</span>
          <span className="trdt__tagline">TRAIN · TRACK · PROGRESS</span>
        </div>

        <nav className="trdt__nav" aria-label="Main">
          <ul className="trdt__nav-list">
            {NAV.map((item) => {
              const active = item.key === 'trainer';
              return (
                <li key={item.key}>
                  <a
                    className={`trdt__nav-link${active ? ' is-active' : ''}`}
                    href={paths[item.key]}
                    aria-current={active ? 'page' : undefined}
                    onClick={(event) => go(event, paths[item.key])}
                  >
                    <span className="trdt__nav-icon">{ICONS[item.key]}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="trdt__side-foot">
          <a className="trdt__nav-link trdt__logout" href={paths.logout} onClick={handleLogout}>
            <span className="trdt__nav-icon">{ICONS.logout}</span>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Main column */}
      <div className="trdt__main">
        <header className="trdt__header trdt-reveal" style={{ '--trdt-delay': '80ms' }}>
          <div className="trdt__crumb">
            <span className="trdt__crumb-icon">
              <TrainerGlyph size={24} />
            </span>
            <span className="trdt__crumb-divider" aria-hidden="true" />
            <span className="trdt__crumb-label">Trainer</span>
          </div>

          <div className="trdt__user">
            <button type="button" className="trdt__bell" aria-label="Notifications">
              <BellIcon />
            </button>
            <span className="trdt__user-divider" aria-hidden="true" />
            <span className="trdt__avatar" aria-hidden="true" />
            <span className="trdt__user-name" title={memberName}>
              {memberName}
            </span>
          </div>
        </header>

        <h1 className="trdt__welcome trdt-reveal" style={{ '--trdt-delay': '140ms' }}>
          Welcome, <span className="trdt__welcome-name">{welcomeName}!</span>
        </h1>

        <main className="trdt__card trdt-reveal" style={{ '--trdt-delay': '200ms' }}>
          <h2 className="trdt__card-title">Trainer</h2>
          <div className="trdt__rule" aria-hidden="true" />

          <div className="trdt__body">
            <div className="trdt__photo trdt-reveal" style={{ '--trdt-delay': '320ms' }}>
              {!photoFailed && (
                <img
                  className="trdt__photo-img"
                  src={photoSrc}
                  alt={`Photo of ${info.firstName} ${info.lastName}`}
                  onError={() => setPhotoFailed(true)}
                />
              )}
            </div>

            <section className="trdt__info" aria-label="Trainer details">
              <h3 className="trdt__name trdt-reveal" style={{ '--trdt-delay': '380ms' }}>
                {fullName}
              </h3>

              <dl className="trdt__facts trdt-reveal" style={{ '--trdt-delay': '440ms' }}>
                <div className="trdt__fact">
                  <dt>Education:</dt> <dd>{info.education}</dd>
                </div>
                <div className="trdt__fact">
                  <dt>Specialization:</dt> <dd>{info.specialization}</dd>
                </div>
                <div className="trdt__fact">
                  <dt>Experience:</dt> <dd>{info.experience}</dd>
                </div>
                <div className="trdt__fact">
                  <dt>Current Clients:</dt> <dd>{info.clients}</dd>
                </div>
                <div className="trdt__fact trdt__fact--message">
                  <dt>Short Message:</dt> <dd>“{info.message}”</dd>
                </div>
              </dl>

              <div className="trdt__actions trdt-reveal" style={{ '--trdt-delay': '520ms' }}>
                <button type="button" className="trdt__button" onClick={() => onViewSchedule?.()}>
                  View Schedule
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
