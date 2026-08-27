import { NAV_FOOTER, ORG, SOCIAL, SOCIAL_ORDER } from '@/constants'
import Icon from '@/components/ui/Icon'
import ActiveLink from './ActiveLink'
import s from './Footer.module.css'

/**
 * Terms/Policies left, copyright centered, social icons right.
 *
 * Footer links are site chrome, so they keep the normal pointer rather than
 * the custom redirect cursors.
 *
 * Stays a Server Component. Only the two nav links need to know the current
 * route, and that knowledge is isolated inside <ActiveLink> — the copyright
 * line and the five social anchors ship as plain HTML.
 */
export default function Footer() {
  return (
    <footer className={s.root}>
      <div className={s.inner}>
        <nav className={s.nav}>
          {NAV_FOOTER.map((item) => (
            <ActiveLink key={item.to} href={item.to!}>
              {item.label}
            </ActiveLink>
          ))}
        </nav>

        <p className={s.copyright}>
          © {ORG.copyrightYear} {ORG.legalName} All rights reserved.
        </p>

        <div className={s.socials}>
          {SOCIAL_ORDER.map((key) => (
            <a
              key={key}
              href={SOCIAL[key].url}
              target="_blank"
              rel="noreferrer"
              aria-label={SOCIAL[key].label}
              className={s.social}
            >
              <Icon name={key} size={18} title={SOCIAL[key].label} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
