/**
 * Conditional class name composition.
 *
 * The prototype used `[a, b && c].filter(Boolean).join(' ')` inline throughout.
 * That works, but it reads badly at the call site and gets repeated 40-odd
 * times. This is the same thing with a name — small enough not to warrant the
 * `clsx` dependency.
 *
 *   cx(s.root, isOpen && s.open, className)
 */
export type ClassValue = string | false | null | undefined

export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}

export default cx
