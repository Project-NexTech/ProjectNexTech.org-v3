/**
 * CSS custom properties cannot be used in media query conditions, so the four
 * breakpoints the design uses have to be literal values in every module file.
 * `postcss-custom-media` defines them once (in src/app/globals.css) and lets
 * modules write `@media (--lg)` instead — 75 usages across 42 files.
 *
 * Turbopack picks this file up automatically (it runs PostCSS configs in a
 * Node worker pool).
 */
const config = {
  plugins: {
    'postcss-custom-media': {},
  },
}

export default config
