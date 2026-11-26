/**
 * Boundary between the Registration page and your future backend.
 *
 * No API exists yet, so this does NOT save anything – it waits briefly so the
 * loading state is visible, then reports `simulated: true`. The page tells the
 * user that nothing was saved.
 *
 * To connect a real API, replace the body with something like:
 *
 *   const res = await fetch('/api/registrations', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(payload),
 *   });
 *   if (!res.ok) throw new Error('We could not save your registration. Please try again.');
 *   const data = await res.json();
 *   return { ok: true, simulated: false, referenceNumber: data.referenceNumber };
 *
 * `referenceNumber` is shown in the read-only "Reference Number" field.
 */
export async function submitRegistration(payload) {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return { ok: true, simulated: true, referenceNumber: '', received: payload };
}
