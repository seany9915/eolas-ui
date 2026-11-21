import * as React from 'react';
import { DirectionProvider } from '@/components/ui/direction-provider';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn, sanitizeUrl } from '@/lib/utils';
import { sanitizeHtml, SanitizedHtml } from '@/lib/sanitize';
import { useYieldingFilter } from '@/lib/scheduler';
import { useLanguageModel, useSummarizer, useTranslator } from '@/lib/built-in-ai';
import { scrollIntoViewAsync } from '@/lib/scroll-completion';
import { useDurationFormat } from '@/lib/format-duration';
import { ComponentDemoProps } from '../types';

export const DirectionProviderDemo: React.FC<ComponentDemoProps> = () => {
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('rtl');
  return (
    <div className="w-full max-w-md mx-auto py-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-heading text-xs font-bold text-on-surface">Direction Context Provider</span>
        <Button size="sm" variant="outline" onClick={() => setDir(dir === 'ltr' ? 'rtl' : 'ltr')}>
          Toggle ({dir.toUpperCase()})
        </Button>
      </div>
      <DirectionProvider direction={dir}>
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant flex flex-col gap-2 text-xs font-sans">
          <p className="font-bold text-on-surface">مستشفى رويال فيكتوريا للأطفال (Royal Victoria Paediatric Hospital)</p>
          <p className="text-on-surface-variant">DirectionProvider sets the CSS `dir` context for bidirectional Base UI primitives.</p>
        </div>
      </DirectionProvider>
    </div>
  );
};

export const CspProviderDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-6 flex flex-col gap-3">
      <div className="p-4 rounded-xl bg-surface border border-outline-variant flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Icon name="security" size="sm" className="text-primary" />
          <span className="font-heading text-xs font-bold text-on-surface">CSP Provider (@base-ui/react/csp-provider)</span>
        </div>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          Provides Content Security Policy nonce context to child Base UI popups, positioners, and portals for strict zero-eval zero-inline-script compliance.
        </p>
      </div>
    </div>
  );
};

export const UtilsDemo: React.FC<ComponentDemoProps> = () => {
  const [candidateUrl, setCandidateUrl] = React.useState('https://eolas.nhs.uk/guidance');
  const safeUrl = sanitizeUrl(candidateUrl);

  return (
    <div className="w-full max-w-lg mx-auto py-6 flex flex-col gap-4">
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading text-sm font-bold text-on-surface">Class & URL Utilities</span>
          <Badge variant="soft" colorRole={safeUrl ? 'success' : 'error'} size="sm">
            {safeUrl ? 'Safe URL' : 'Blocked URL'}
          </Badge>
        </div>
        <Field className="gap-1.5">
          <FieldLabel htmlFor="utils-url-input">Test URL check</FieldLabel>
          <Input
            id="utils-url-input"
            value={candidateUrl}
            onChange={(e) => setCandidateUrl(e.target.value)}
            placeholder="Enter a URL to check"
          />
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" colorRole="neutral" onClick={() => setCandidateUrl('https://eolas.nhs.uk/guidance')}>
            Valid HTTPS
          </Button>
          <Button size="sm" variant="outline" colorRole="neutral" onClick={() => setCandidateUrl('javascript:alert(1)')}>
            Unsafe script URL
          </Button>
        </div>
        <div className={cn('p-3 rounded-lg border font-mono text-xs', safeUrl ? 'bg-surface border-outline-variant text-on-surface' : 'bg-error-container border-transparent text-on-error-container')}>
          {safeUrl ?? 'Blocked unsafe protocol'}
        </div>
      </div>
    </div>
  );
};

export const SanitizeDemo: React.FC<ComponentDemoProps> = () => {
  const [rawHtml, setRawHtml] = React.useState(
    '<p>Patient advised <strong>rest</strong> and fluids.</p><img src="x" onerror="alert(1)" /><script>alert(2)</script>'
  );
  const cleanedHtml = React.useMemo(() => sanitizeHtml(rawHtml), [rawHtml]);

  return (
    <div className="w-full max-w-lg mx-auto py-6 flex flex-col gap-4">
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading text-sm font-bold text-on-surface">Untrusted HTML Sanitizer</span>
          <Button
            size="sm"
            variant="outline"
            colorRole="neutral"
            onClick={() =>
              setRawHtml(
                '<p>Follow-up booked in <em>2 weeks</em>.</p><a href="javascript:alert(1)">Unsafe link</a>'
              )
            }
          >
            Swap sample
          </Button>
        </div>
        <div className="p-3 rounded-lg bg-surface border border-outline-variant flex flex-col gap-1.5">
          <span className="font-label text-xs text-on-surface-variant">Rendered output</span>
          <SanitizedHtml html={rawHtml} className="typeset text-sm" />
        </div>
        <div className="p-3 rounded-lg bg-surface border border-outline-variant flex flex-col gap-1">
          <span className="font-label text-xs text-on-surface-variant">Clean markup</span>
          <code className="font-mono text-xs text-primary break-all">{cleanedHtml}</code>
        </div>
      </div>
    </div>
  );
};

const SCHEDULER_SAMPLE_ITEMS = [
  'Paediatric fever pathway',
  'Asthma acute wheeze',
  'Bronchiolitis guidance',
  'Sepsis recognition checklist',
  'Anaphylaxis dosing guide',
  'Febrile neutropenia triage',
];

export const SchedulerDemo: React.FC<ComponentDemoProps> = () => {
  const [query, setQuery] = React.useState('');
  const predicate = React.useCallback(
    (item: string) => item.toLowerCase().includes(query.trim().toLowerCase()),
    [query]
  );
  const { filtered, isFiltering } = useYieldingFilter(
    SCHEDULER_SAMPLE_ITEMS,
    predicate,
    { budgetMs: 8, deps: [query] }
  );

  return (
    <div className="w-full max-w-lg mx-auto py-6 flex flex-col gap-4">
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading text-sm font-bold text-on-surface">Cooperative Filter Scheduler</span>
          <Badge variant="soft" colorRole={isFiltering ? 'warning' : 'primary'} size="sm">
            {isFiltering ? 'Filtering' : `${filtered.length} matches`}
          </Badge>
        </div>
        <Field className="gap-1.5">
          <FieldLabel htmlFor="scheduler-filter-input">Filter clinical notes</FieldLabel>
          <Input
            id="scheduler-filter-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            clearable={Boolean(query)}
            onClear={() => setQuery('')}
            placeholder="Search guidelines..."
          />
        </Field>
        <ul className="flex flex-col gap-1.5">
          {filtered.map((item) => (
            <li
              key={item}
              className="px-3 py-2 rounded-lg bg-surface border border-outline-variant font-sans text-xs text-on-surface"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const BuiltInAiDemo: React.FC<ComponentDemoProps> = () => {
  const promptApi = useLanguageModel();
  const summarizerApi = useSummarizer();
  const translatorApi = useTranslator({ sourceLanguage: 'en', targetLanguage: 'es' });

  const entries = [
    { label: 'Prompt API', supported: promptApi.isSupported, availability: promptApi.availability },
    { label: 'Summarizer API', supported: summarizerApi.isSupported, availability: summarizerApi.availability },
    { label: 'Translator API', supported: translatorApi.isSupported, availability: translatorApi.availability },
  ];

  return (
    <div className="w-full max-w-lg mx-auto py-6 flex flex-col gap-3">
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Icon name="psychology" size="sm" className="text-primary" />
          <span className="font-heading text-sm font-bold text-on-surface">On-Device Browser AI Status</span>
        </div>
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <div
              key={entry.label}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-surface border border-outline-variant"
            >
              <span className="font-sans text-xs font-medium text-on-surface">{entry.label}</span>
              <Badge
                variant="soft"
                colorRole={entry.availability === 'available' ? 'success' : entry.supported ? 'warning' : 'neutral'}
                size="sm"
              >
                {entry.availability}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ScrollCompletionDemo: React.FC<ComponentDemoProps> = () => {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const targetRef = React.useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = React.useState('Idle');

  const handleScrollToTarget = async () => {
    if (!targetRef.current || !scrollerRef.current) return;
    setStatus('Scrolling');
    await scrollIntoViewAsync(
      targetRef.current,
      { behavior: 'smooth', block: 'nearest' },
      { scroller: scrollerRef.current }
    );
    setStatus('Arrived');
  };

  return (
    <div className="w-full max-w-lg mx-auto py-6 flex flex-col gap-3">
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading text-sm font-bold text-on-surface">Scroll Completion Promise</span>
          <Badge variant="soft" colorRole={status === 'Arrived' ? 'success' : 'primary'} size="sm">
            {status}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={handleScrollToTarget}>
            Scroll to target
          </Button>
          <Button
            size="sm"
            variant="outline"
            colorRole="neutral"
            onClick={() => {
              if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
              setStatus('Idle');
            }}
          >
            Reset top
          </Button>
        </div>
        <div
          ref={scrollerRef}
          className="h-40 overflow-y-auto rounded-lg bg-surface border border-outline-variant p-3 flex flex-col gap-3"
        >
          <div className="p-3 rounded bg-surface-container text-xs font-sans text-on-surface-variant">Section 1: Overview</div>
          <div className="p-3 rounded bg-surface-container text-xs font-sans text-on-surface-variant">Section 2: Assessment</div>
          <div className="p-3 rounded bg-surface-container text-xs font-sans text-on-surface-variant">Section 3: Dosing</div>
          <div
            ref={targetRef}
            className="p-3 rounded bg-primary-container text-on-primary-container text-xs font-sans font-semibold"
          >
            Target section reached
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormatDurationDemo: React.FC<ComponentDemoProps> = () => {
  const [style, setStyle] = React.useState<'long' | 'short' | 'narrow' | 'digital'>('long');
  const formatted = useDurationFormat({ hours: 1, minutes: 30, seconds: 15 }, { style });

  return (
    <div className="w-full max-w-lg mx-auto py-6 flex flex-col gap-4">
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-heading text-sm font-bold text-on-surface">Duration Formatting</span>
          <Badge variant="soft" colorRole="primary" size="sm">
            {style}
          </Badge>
        </div>
        <ToggleGroup
          type="single"
          value={style}
          onValueChange={(val) => {
            if (val) setStyle(val as 'long' | 'short' | 'narrow' | 'digital');
          }}
          size="sm"
          aria-label="Duration format style"
        >
          <ToggleGroupItem value="long">Long</ToggleGroupItem>
          <ToggleGroupItem value="short">Short</ToggleGroupItem>
          <ToggleGroupItem value="narrow">Narrow</ToggleGroupItem>
          <ToggleGroupItem value="digital">Digital</ToggleGroupItem>
        </ToggleGroup>
        <div className="p-3 rounded-lg bg-surface border border-outline-variant font-heading text-base font-bold text-on-surface tabular-nums">
          {formatted}
        </div>
      </div>
    </div>
  );
};
