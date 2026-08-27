/**
 * Reduced-motion check, shared by the three components that cannot express
 * their reduced-motion behavior in CSS alone (Reveal, CountUp, Carousel).
 *
 * WARNING: This is a plain function, not a hook, and it must stay that way.
 *
 * All three call it from a `useState` INITIALIZER, so the component starts in
 * its final, unanimated state. The obvious alternative — an effect that calls
 * setState once mounted — is rejected by `react-hooks/set-state-in-effect`,
 * and a `useReducedMotion()` hook returning `false` on the server would
 * reintroduce exactly the flash-then-correct behavior this avoids. The
 * prototype's CLAUDE.md flags all three as "don't tidy this back".
 *
 * The `typeof window` guard is what makes it safe to call during prerender:
 * on the server it reports false, and the CSS in globals.css covers the
 * server-rendered frame.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
