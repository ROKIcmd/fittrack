import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import QrPanel from '../../components/QrPanel/QrPanel';
import Select from '../../components/Select/Select';
import TextField from '../../components/TextField/TextField';
import { useAuth } from '../../context/AuthContext';
import {
  getAge,
  validateBirthDate,
  validateFullName,
  validateHeightM,
  validateRequiredChoice,
  validateRequiredText,
  validateWeightKg,
} from '../../utils/validators';
import './Registration.css';

const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const MEMBERSHIP_OPTIONS = [
  { value: 'bronze', label: 'Bronze' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
];

// Order used to focus the first invalid field
const FIELD_ORDER = ['name', 'birthDate', 'sex', 'weight', 'height', 'goal', 'type', 'referenceNumber'];

const INITIAL_VALUES = {
  name: '',
  birthDate: '',
  sex: '',
  weight: '',
  height: '',
  goal: '',
  type: '',
  referenceNumber: '',
};

const INITIAL_SHAKE = Object.fromEntries(FIELD_ORDER.map((field) => [field, 0]));

function getErrors(values) {
  return {
    name: validateFullName(values.name),
    birthDate: validateBirthDate(values.birthDate),
    sex: validateRequiredChoice(values.sex, 'Please select your sex.'),
    weight: validateWeightKg(values.weight), // optional
    height: validateHeightM(values.height), // optional
    goal: validateRequiredText(values.goal, 'Please enter your primary goal.'),
    type: validateRequiredChoice(values.type, 'Please choose a membership type.'),
    referenceNumber: values.referenceNumber?.trim()
      ? ''
      : 'Please enter your payment reference number from the QR receipt.',
  };
}

/**
 * Splits "LastName, FirstName Middle" or "FirstName LastName" into separate strings.
 */
function splitFullName(fullName = '') {
  const trimmed = fullName.trim();
  if (trimmed.includes(',')) {
    const [last, ...rest] = trimmed.split(',');
    return {
      firstName: rest.join(' ').trim() || 'Member',
      lastName: last.trim() || 'User',
    };
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0] || 'Member', lastName: 'User' };
  }
  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts[parts.length - 1],
  };
}

export default function Registration({
  qrSrc = '/assets/payment-qr.png',
  referenceNumber: initialReference = '',
  onProceed,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();

  // Retrieve deferred credentials from step 1 (/register)
  const credentials = location.state;

  // If user accesses /register/details directly without credentials, bounce to /register
  useEffect(() => {
    if (!credentials?.email || !credentials?.password) {
      navigate('/register', { replace: true });
    }
  }, [credentials, navigate]);

  const [values, setValues] = useState({
    ...INITIAL_VALUES,
    referenceNumber: initialReference,
  });
  const [touched, setTouched] = useState({});
  const [shake, setShake] = useState(INITIAL_SHAKE);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [statusMessage, setStatusMessage] = useState('');

  const inputRefs = {
    name: useRef(null),
    birthDate: useRef(null),
    sex: useRef(null),
    weight: useRef(null),
    height: useRef(null),
    goal: useRef(null),
    type: useRef(null),
    referenceNumber: useRef(null),
  };

  const errors = getErrors(values);
  const visibleError = (field) => (touched[field] ? errors[field] : '');
  const isValid = (field) => values[field] !== '' && !errors[field];
  const age = getAge(values.birthDate);
  const ageText = age !== '' && age >= 0 ? String(age) : '';

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (status === 'success' || status === 'error') setStatus('idle');
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'loading' || status === 'success') return;

    setTouched(Object.fromEntries(FIELD_ORDER.map((field) => [field, true])));

    const invalidFields = FIELD_ORDER.filter((field) => errors[field]);
    if (invalidFields.length > 0) {
      setShake((prev) => {
        const next = { ...prev };
        invalidFields.forEach((field) => {
          next[field] += 1;
        });
        return next;
      });
      inputRefs[invalidFields[0]].current?.focus();
      return;
    }

    const { firstName, lastName } = splitFullName(values.name);

    // Payload formatted to match AuthController.RegisterRequest
    const payload = {
      email: credentials.email,
      password: credentials.password,
      firstName,
      lastName,
      dateOfBirth: values.birthDate,
      sex: values.sex,
      age: age ? Number(age) : null,
      weightKg: values.weight ? Number(values.weight) : null,
      heightMeters: values.height ? Number(values.height) : null,
      primaryGoal: values.goal.trim(),
      membershipTier: values.type.toUpperCase(),
      billingCycle: 'MONTHLY',
      referenceNumber: values.referenceNumber.trim(),
    };

    setStatus('loading');
    try {
      // Calls AuthContext -> authService.register (/api/auth/register)
      await authRegister(payload);

      setStatusMessage('Registration successful! Redirecting to your dashboard…');
      setStatus('success');
      onProceed?.(payload);

      // Redirect directly into the Member Dashboard
      setTimeout(() => {
        navigate('/member/dashboard', { replace: true });
      }, 700);
    } catch (error) {
      setStatusMessage(error.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  const reveal = (index) => ({ '--i': index });
  const statusOpen = status === 'success' || status === 'error';

  return (
    <main className="reg">
      <div className="reg__photo" aria-hidden="true">
        <img className="reg__photo-img" src="/assets/gym-bg.png" alt="" />
      </div>
      <div className="reg__shade" aria-hidden="true" />

      <h1 className="reg__title reg-reveal" style={reveal(0)}>
        Registration
      </h1>

      <form
        className="reg__content"
        onSubmit={handleSubmit}
        noValidate
        aria-busy={status === 'loading'}
      >
        <div className="reg__body">
          {/* ------------------------- Personal information ------------------------- */}
          <section className="reg__col reg__col--left" aria-labelledby="reg-personal">
            <h2 id="reg-personal" className="reg__heading reg-reveal" style={reveal(1)}>
              Personal Information
            </h2>

            <div className="reg__fields">
              <TextField
                ref={inputRefs.name}
                className="reg-reveal"
                style={reveal(2)}
                label="Name:"
                labelVisible
                name="name"
                autoComplete="name"
                placeholder="Dela Cruz, Juan A."
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={visibleError('name')}
                valid={isValid('name')}
                shakeSignal={shake.name}
                required
              />

              <TextField
                ref={inputRefs.birthDate}
                className="reg-reveal"
                style={reveal(3)}
                label="Date of Birth:"
                labelVisible
                name="birthDate"
                type="date"
                autoComplete="bday"
                value={values.birthDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={visibleError('birthDate')}
                valid={isValid('birthDate')}
                shakeSignal={shake.birthDate}
                required
              />

              <div className="reg__row">
                <Select
                  ref={inputRefs.sex}
                  className="reg-reveal"
                  style={reveal(4)}
                  label="Sex:"
                  labelVisible
                  name="sex"
                  placeholder="Male/Female"
                  options={SEX_OPTIONS}
                  value={values.sex}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={visibleError('sex')}
                  valid={isValid('sex')}
                  shakeSignal={shake.sex}
                  required
                />

                <TextField
                  className="reg-reveal"
                  style={reveal(4)}
                  label="Age:"
                  labelVisible
                  name="age"
                  placeholder="00"
                  value={ageText}
                  inputProps={{ readOnly: true, 'aria-readonly': 'true' }}
                />
              </div>

              <h3 className="reg__subheading reg-reveal" style={reveal(5)}>
                Physical Measurements
              </h3>

              <div className="reg__row">
                <TextField
                  ref={inputRefs.weight}
                  className="reg-reveal"
                  style={reveal(6)}
                  label="Weight(kg):"
                  labelVisible
                  name="weight"
                  type="number"
                  inputMode="decimal"
                  placeholder="00.0"
                  value={values.weight}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={visibleError('weight')}
                  valid={isValid('weight')}
                  shakeSignal={shake.weight}
                  inputProps={{ step: '0.1', min: '0' }}
                />

                <TextField
                  ref={inputRefs.height}
                  className="reg-reveal"
                  style={reveal(6)}
                  label="Height(m):"
                  labelVisible
                  name="height"
                  type="number"
                  inputMode="decimal"
                  placeholder="00.0"
                  value={values.height}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={visibleError('height')}
                  valid={isValid('height')}
                  shakeSignal={shake.height}
                  inputProps={{ step: '0.01', min: '0' }}
                />
              </div>
            </div>
          </section>

          <div className="reg__divider reg-reveal" style={reveal(2)} aria-hidden="true" />

          {/* --------------------------- Membership plan ---------------------------- */}
          <section className="reg__col reg__col--right" aria-labelledby="reg-plan">
            <h2 id="reg-plan" className="reg__heading reg-reveal" style={reveal(1)}>
              Membership Plan
            </h2>

            <div className="reg__fields">
              <TextField
                ref={inputRefs.goal}
                className="reg-reveal"
                style={reveal(2)}
                label="Primary Goal:"
                labelVisible
                name="goal"
                placeholder="e.g. Muscle gain"
                value={values.goal}
                onChange={handleChange}
                onBlur={handleBlur}
                error={visibleError('goal')}
                valid={isValid('goal')}
                shakeSignal={shake.goal}
                required
              />

              <Select
                ref={inputRefs.type}
                className="reg-reveal"
                style={reveal(3)}
                label="Type:"
                labelVisible
                name="type"
                placeholder="Bronze/Silver/Gold"
                options={MEMBERSHIP_OPTIONS}
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
                error={visibleError('type')}
                valid={isValid('type')}
                shakeSignal={shake.type}
                required
              />

              <div className="reg__qr reg-reveal" style={reveal(4)}>
                <p className="reg__qr-label" id="reg-qr-label">
                  Scan and Pay:
                </p>
                <QrPanel src={qrSrc} alt="QR code for membership payment" />
              </div>

              {/* Editable Reference Number so user can type the QR payment receipt code */}
              <TextField
                ref={inputRefs.referenceNumber}
                className="reg-reveal"
                style={reveal(5)}
                label="Reference Number:"
                labelVisible
                name="referenceNumber"
                placeholder="e.g. GCASH-19283749"
                value={values.referenceNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={visibleError('referenceNumber')}
                valid={isValid('referenceNumber')}
                shakeSignal={shake.referenceNumber}
                required
              />
            </div>
          </section>
        </div>

        <div className="reg__actions reg-reveal" style={reveal(7)}>
          <p
            className={`reg__status reg__status--${status}${statusOpen ? ' is-open' : ''}`}
            role="status"
            aria-live="polite"
          >
            {statusMessage}
          </p>

          <Button
            type="submit"
            width={288}
            loading={status === 'loading'}
            success={status === 'success'}
          >
            Confirm &amp; Proceed
          </Button>
        </div>
      </form>
    </main>
  );
}