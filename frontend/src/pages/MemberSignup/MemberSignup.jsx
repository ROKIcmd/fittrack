import { useRef, useState } from 'react';
import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox/Checkbox';
import { LockIcon, MailIcon } from '../../components/Icons/Icons';
import Logo from '../../components/Logo/Logo';
import PasswordStrength from '../../components/PasswordStrength/PasswordStrength';
import TextField from '../../components/TextField/TextField';
import { useAuth } from '../../context/AuthContext';
import './MemberSignup.css';

const FIELD_ORDER = ['email', 'password', 'confirmPassword', 'confirmed'];

const INITIAL_VALUES = {
  email: '',
  password: '',
  confirmPassword: '',
  confirmed: false,
};

const INITIAL_SHAKE = { email: 0, password: 0, confirmPassword: 0, confirmed: 0 };

function getErrors(values) {
  const email = values.email.trim();
  const password = values.password;

  let emailError = '';
  if (!email) emailError = 'Email is required.';
  else if (!/^\S+@\S+\.\S+$/.test(email)) emailError = 'Please enter a valid email address.';

  let passwordError = '';
  if (!password) passwordError = 'Password is required.';
  else if (password.length < 6) passwordError = 'Password must be at least 6 characters.';

  let confirmError = '';
  if (!values.confirmPassword) confirmError = 'Please verify your password.';
  else if (values.confirmPassword !== password) confirmError = 'Passwords do not match.';

  return {
    email: emailError,
    password: passwordError,
    confirmPassword: confirmError,
    confirmed: values.confirmed ? '' : 'Please tick “Confirm Password” to continue.',
  };
}

function deriveNameFromEmail(email) {
  const localPart = email.split('@')[0] || 'Member';
  const parts = localPart
      .split(/[._-]+/)
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());

  return {
    firstName: parts[0] || 'Member',
    lastName: parts.slice(1).join(' ') || 'User',
  };
}

export default function MemberSignup({
                                       loginHref = '/login',
                                       onLoginClick,
                                       onRegisterSuccess = () => {},
                                     }) {
  const { register } = useAuth();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [shake, setShake] = useState(INITIAL_SHAKE);
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const inputRefs = {
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
    confirmed: useRef(null),
  };

  const errors = getErrors(values);
  const visibleError = (name) => (touched[name] ? errors[name] : '');
  const isValid = (name) => Boolean(values[name]) && !errors[name];

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'confirmed') setTouched((prev) => ({ ...prev, confirmed: true }));
    if (status === 'success' || status === 'error') setStatus('idle');
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'loading' || status === 'success') return;

    setTouched({ email: true, password: true, confirmPassword: true, confirmed: true });

    const invalidFields = FIELD_ORDER.filter((name) => errors[name]);
    if (invalidFields.length > 0) {
      setShake((prev) => {
        const next = { ...prev };
        invalidFields.forEach((name) => {
          next[name] += 1;
        });
        return next;
      });
      inputRefs[invalidFields[0]].current?.focus();
      return;
    }

    setStatus('loading');
    try {
      const cleanEmail = values.email.trim();
      const { firstName, lastName } = deriveNameFromEmail(cleanEmail);
      const user = await register({
        firstName,
        lastName,
        email: cleanEmail,
        password: values.password,
      });
      setStatusMessage('Your account has been created.');
      setStatus('success');
      onRegisterSuccess(user);
    } catch (error) {
      setStatusMessage(error.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  const reveal = (index) => ({ '--i': index });
  const statusOpen = status === 'success' || status === 'error';

  return (
      <main className="signup">
        <div className="signup__photo" aria-hidden="true">
          <img className="signup__photo-img" src="/assets/gym-bg.png" alt="" />
        </div>
        <div className="signup__shade" aria-hidden="true" />

        <div className="signup__layout">
          <section className="signup__card" aria-labelledby="signup-title">
            <span className="signup__glow" aria-hidden="true" />

            <h1 id="signup-title" className="signup__title signup-reveal" style={reveal(0)}>
              WELCOME
            </h1>

            <form
                className="signup__form"
                onSubmit={handleSubmit}
                noValidate
                aria-busy={status === 'loading'}
            >
              <TextField
                  ref={inputRefs.email}
                  className="signup-reveal"
                  style={reveal(1)}
                  label="Email address"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="juandelacruz@gmail.com"
                  icon={MailIcon}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={visibleError('email')}
                  valid={isValid('email')}
                  shakeSignal={shake.email}
                  required
              />

              <TextField
                  ref={inputRefs.password}
                  className="signup-reveal"
                  style={reveal(2)}
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter Password"
                  icon={LockIcon}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={visibleError('password')}
                  valid={isValid('password')}
                  shakeSignal={shake.password}
                  required
              >
                <PasswordStrength password={values.password} />
              </TextField>

              <TextField
                  ref={inputRefs.confirmPassword}
                  className="signup-reveal"
                  style={reveal(3)}
                  label="Verify password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Verify Entered Password"
                  icon={LockIcon}
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={visibleError('confirmPassword')}
                  valid={isValid('confirmPassword')}
                  shakeSignal={shake.confirmPassword}
                  required
              />

              <Checkbox
                  ref={inputRefs.confirmed}
                  className="signup__confirm signup-reveal"
                  style={reveal(4)}
                  name="confirmed"
                  label="Confirm Password"
                  checked={values.confirmed}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={visibleError('confirmed')}
                  shakeSignal={shake.confirmed}
                  required
              />

              <div className="signup__actions signup-reveal" style={reveal(5)}>
                <Button
                    type="submit"
                    loading={status === 'loading'}
                    success={status === 'success'}
                >
                  {status === 'success' ? 'Done' : 'Register'}
                </Button>
              </div>

              <div
                  className={`signup__status signup__status--${status}${statusOpen ? ' is-open' : ''}`}
                  role="status"
                  aria-live="polite"
              >
                <div className="signup__status-inner">
                  <p>{statusMessage}</p>
                </div>
              </div>
            </form>

            <hr className="signup__divider signup-reveal" style={reveal(6)} />

            <p className="signup__footer signup-reveal" style={reveal(7)}>
              Already have an account?{' '}
              <a href={loginHref} onClick={onLoginClick}>
                Log In
              </a>
            </p>
          </section>

          <aside className="signup__brand">
            <Logo className="signup-reveal signup__logo" style={reveal(2)} />
            <p className="signup__headline signup-reveal" style={reveal(4)}>
              Track, Manage, Guide and Organize, all in one <span>App</span>
            </p>
          </aside>
        </div>
      </main>
  );
}