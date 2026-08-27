import type { Metadata } from 'next'

import Article, { ArticleMeta, ArticleSection, Highlight, P } from '@/components/article/Article'
import PageHeader from '@/components/ui/PageHeader'
import ProtectedEmail from '@/components/ui/ProtectedEmail'
import { EMAILS } from '@/constants'
import s from './page.module.css'

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms and conditions for using the Project NexTech website and attending our programs.',
}

/**
 * PLACEHOLDER LEGAL COPY — NOT REVIEWED BY A LAWYER.
 *
 * Every paragraph here is placeholder text written to give the page realistic
 * shape and length. It is structured like a terms page but has no legal
 * standing and must be replaced before the site goes live.
 *
 * The brief specifies enhanced article formatting with the left column only,
 * which is what <Article fullWidth> renders.
 */
interface TermsBlock {
  highlight: string
}

interface TermsSection {
  id: string
  title: string
  blocks: readonly (string | TermsBlock)[]
}

const SECTIONS: readonly TermsSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of these terms',
    blocks: [
      'This is placeholder text stating that using this website or attending a program constitutes agreement to these terms. It should explain that the terms apply to students, parents and guardians, volunteers, and partner organizations alike. It should note that anyone who does not agree should not use the site or register for programs.',
      { highlight: 'These terms are placeholder text and carry no legal weight until reviewed.' },
      'This is placeholder text describing which other documents sit alongside these terms, including the organization Constitution and any program-specific agreements. It should explain what happens when two documents disagree, and which one takes precedence.',
      'This is placeholder text about the age at which someone can accept these terms on their own behalf, and when a parent or guardian must accept on behalf of a minor.',
    ],
  },
  {
    id: 'eligibility',
    title: '2. Who may participate',
    blocks: [
      'This is placeholder text describing who is eligible to attend our programs, including any grade or age requirements and how those are applied in regions that do not use the same school system. It should be clear that programs are free and open regardless of background.',
      'This is placeholder text describing who is eligible to volunteer, what the minimum commitment is, and what onboarding a new volunteer goes through before working with students.',
      'This is placeholder text about circumstances under which participation may be declined or withdrawn, and who makes that decision within the organization.',
    ],
  },
  {
    id: 'registration',
    title: '3. Program registration and attendance',
    blocks: [
      'This is placeholder text explaining how registration works, what information we collect at signup, and how a spot in a program is confirmed. It should describe what happens when a program is oversubscribed and how a waitlist is handled.',
      'This is placeholder text about cancellations — both when a family cancels and when we have to cancel or reschedule a session ourselves. It should say how much notice each party should expect.',
      { highlight: 'Placeholder line about our commitment to keeping every program free to attend.' },
      'This is placeholder text describing what materials we provide at a program and what, if anything, a student is expected to bring with them.',
    ],
  },
  {
    id: 'conduct',
    title: '4. Conduct expectations',
    blocks: [
      'This is placeholder text setting out what we expect from students during a program, framed around keeping sessions safe and productive for everyone in the room. It should be written in language a young student can actually read.',
      'This is placeholder text setting out what we expect from volunteers, including how they are expected to treat students, venue staff, and each other.',
      'This is placeholder text describing how conduct concerns are raised and reviewed, and what outcomes are possible at the end of that process.',
    ],
  },
  {
    id: 'media',
    title: '5. Photography and media',
    blocks: [
      'This is placeholder text explaining that we photograph programs for use on this website and our social media, and how a family can decline to have their student photographed. It should say who to contact and how far in advance.',
      'This is placeholder text about how long we retain program photography, where it is stored, and the circumstances under which we would remove a photo on request.',
      { highlight: 'Placeholder line about only ever using real photos of real programs.' },
      'This is placeholder text about media submitted to us by volunteers or partners, and who holds the rights to it once it appears on this site.',
    ],
  },
  {
    id: 'liability',
    title: '6. Limitation of liability',
    blocks: [
      'This is placeholder text describing the limits of our responsibility during in-person programs held at partner venues, and the role the venue itself plays. This section in particular must be written or reviewed by a lawyer before publication.',
      'This is placeholder text about supervision expectations for younger students, including whether a parent or guardian is required to remain on site.',
      'This is placeholder text about the accuracy of material taught in our programs and published on this site, and the absence of any warranty attached to it.',
    ],
  },
  {
    id: 'changes',
    title: '7. Changes to these terms',
    blocks: [
      'This is placeholder text explaining that these terms may be revised, how a revision is published, and how the effective date at the top of this page is updated when that happens.',
      'This is placeholder text about how significant changes are communicated to families and volunteers who have already registered for a program.',
      'This is placeholder text noting that continued use of the site or attendance at programs after a revision constitutes acceptance of the revised terms.',
    ],
  },
]

export default function TermsPage() {
  return (
    <div>
      <PageHeader
        title="Terms and conditions"
        subtitle="This is placeholder subtitle text describing the scope of this document and who it applies to."
      />

      <Article fullWidth>
        <ArticleMeta
          authors={['Placeholder Author', 'Placeholder Reviewer']}
          date="Effective August 12, 2026"
          links={[{ label: 'Organization Constitution', url: '/policies' }]}
        />

        {SECTIONS.map((section) => (
          <ArticleSection key={section.id} id={section.id} title={section.title}>
            {section.blocks.map((block, index) =>
              typeof block === 'string' ? (
                <P key={index}>{block}</P>
              ) : (
                <Highlight key={index}>{block.highlight}</Highlight>
              ),
            )}
          </ArticleSection>
        ))}

        <ArticleSection id="contact" title="Questions about these terms">
          <P>
            For general questions about this document or anything else about the organization,
            email <ProtectedEmail email={EMAILS.info} className={s.email} />. For official
            communication that needs to reach our management directly, email{' '}
            <ProtectedEmail email={EMAILS.ec} accent="blue" className={s.email} />.
          </P>
        </ArticleSection>
      </Article>
    </div>
  )
}
