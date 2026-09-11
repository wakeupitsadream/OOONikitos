import { CalendarDays } from 'lucide-react';
import { SITES, type SiteId } from '@/config/sites';
import {
  POLICY_LEAD,
  POLICY_UPDATED_AT,
  POLICY_UPDATED_LABEL,
  privacyPolicy,
  type PolicyBlock,
} from '@/content/legal';
import { typograf } from '@/lib/typograf';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';

type PrivacyPolicyProps = {
  site: SiteId;
};

function Block({ block }: { block: PolicyBlock }) {
  if (block.kind === 'text') {
    return <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-muted">{typograf(block.text)}</p>;
  }

  if (block.kind === 'list') {
    return (
      <div className="mt-4">
        {block.lead ? (
          <p className="text-[0.9375rem] leading-relaxed text-fg-muted">{typograf(block.lead)}</p>
        ) : null}
        <ul className="mt-3 space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-fg-muted">
              <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden="true" />
              <span>{typograf(item)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <dl className="mt-5 divide-y divide-border border-y border-border">
      {block.items.map((item) => (
        <div key={item.term} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm text-fg-subtle">{item.term}</dt>
          <dd className="text-[0.9375rem] font-semibold">{typograf(item.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Политика конфиденциальности: один компонент на три сайта.
 * Текст и реквизиты — из content/legal.ts, отличается только сайт.
 * Страница закрыта от индексации на уровне метаданных (§9 п. 1 плана).
 */
export function PrivacyPolicy({ site }: PrivacyPolicyProps) {
  const sections = privacyPolicy(site);
  const config = SITES[site];

  return (
    <>
      <Section compact>
        <Reveal>
          <p className="eyebrow text-accent-ink">Правовая информация</p>
          {/* На 375 px слово «конфиденциальности» в кегле display-lg рвётся
              посередине — на узких экранах уменьшаем заголовок. */}
          <h1 className="display-lg mt-3 max-sm:text-[1.625rem]">Политика конфиденциальности</h1>
          <p className="lead mt-4 max-w-2xl">{typograf(POLICY_LEAD)}</p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-xs)] bg-surface-2 px-3 py-1.5 text-sm text-fg-muted">
            <CalendarDays className="size-4 text-accent-ink" aria-hidden="true" />
            <span>
              Редакция от <time dateTime={POLICY_UPDATED_AT}>{POLICY_UPDATED_LABEL}</time> · сайт{' '}
              {config.shortName}
            </span>
          </p>
        </Reveal>
      </Section>

      <Section tone="deep">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-14">
          <nav aria-label="Содержание политики" className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-fg-subtle">Содержание</p>
            <ol className="mt-4 space-y-2 text-sm">
              {sections.map((section, index) => (
                <li key={section.id} className="flex gap-2.5">
                  <span className="tabular text-fg-subtle">{index + 1}.</span>
                  <a
                    href={`#${section.id}`}
                    className="text-fg-muted underline-offset-4 transition-colors hover:text-accent-ink hover:underline"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0 max-w-3xl space-y-10">
            {sections.map((section, index) => (
              <article key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="display-md">
                  <span className="tabular mr-2 text-accent-ink">{index + 1}.</span>
                  {section.title}
                </h2>
                {section.blocks.map((block, blockIndex) => (
                  <Block key={`${section.id}-${blockIndex}`} block={block} />
                ))}
              </article>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
