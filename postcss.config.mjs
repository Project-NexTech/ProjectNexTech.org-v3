/**
 * CSS custom properties cannot be used in media query conditions, so the four
 * breakpoints the design uses have to be literal values in every module file.
 * `postcss-custom-media` lets modules write `@media (--lg)` instead — around 75
 * usages across the component tree.
 *
 * The two plugins are a pair, and the ORDER MATTERS:
 *
 *   1. `postcss-global-data` injects the @custom-media declarations from
 *      src/app/breakpoints.css into every file it processes.
 *   2. `postcss-custom-media` then resolves them.
 *
 * Step 1 is not optional. postcss-custom-media resolves declarations per file,
 * so without it only the file that literally contains the declarations gets
 * them — and a `@media (--lg)` anywhere else ships to the browser unresolved,
 * where it is silently ignored rather than erroring. Every responsive rule in
 * every *.module.css depends on this.
 *
 * Turbopack picks this file up automatically (it runs PostCSS configs in a
 * Node worker pool).
 */
const config = {
  plugins: {
    '@csstools/postcss-global-data': {
      files: ['./src/app/breakpoints.css'],
    },
    'postcss-custom-media': {},
  },
}

export default config
