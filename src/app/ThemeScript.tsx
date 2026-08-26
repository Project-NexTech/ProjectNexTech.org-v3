import { THEME_STORAGE_KEY } from '@/lib/theme'

/**
 * Sets `data-theme` on <html> BEFORE first paint.
 *
 * Moving the prototype's module-scope `localStorage` read into a mount effect
 * (NEXTJS_MIGRATION.md §2.5) fixed the prerender crash but introduced a flash:
 * the server has no way to know the visitor's stored preference, so the first
 * painted frame would use the default dark tokens even for someone who chose
 * light. This script closes that gap.
 *
 * It must be render-blocking — no `defer`, no `async`, and it has to sit in
 * <head> above the stylesheet. `dangerouslySetInnerHTML` is the only way to
 * emit an inline script from a Server Component; the content is a constant, so
 * nothing untrusted is interpolated.
 *
 * The behavior mirrors SiteProvider exactly: an explicit choice sets the
 * attribute; 'system' (or an unreadable store) leaves it absent so the
 * `prefers-color-scheme` media query in globals.css takes over.
 */
const script = `
(function () {
  try {
    var stored = window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (e) {
    /* Private browsing throws on localStorage. Fall through to the media query. */
  }
})();
`

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
