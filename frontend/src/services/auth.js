/**
 * Boundary between the UI and your future backend.
 *
 * No API exists yet, so this does NOT create or store an account – it only
 * waits briefly so the loading state can be seen, then reports
 * `simulated: true`. The sign-up page reads that flag and tells the user
 * that nothing was saved.
 *
 * To connect a real API, replace the body with something like:
 *
 *   const res = await fetch('/api/members', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(payload),
 *   });
 *   if (!res.ok) throw new Error('We could not create your account. Please try again.');
 *   return { ok: true, simulated: false };
 */
export async function registerMember(payload) {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return { ok: true, simulated: true, email: payload.email };
}
