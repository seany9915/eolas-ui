import * as React from 'react';
import { NumberRoll } from '@/components/ui/number-roll';
import { SpinningCounter } from '@/components/ui/spinning-counter';
import { NumberPopIn } from '@/components/ui/number-pop-in';
import { TextSwap } from '@/components/ui/text-swap';
import { TextsReveal, TextsRevealLine } from '@/components/ui/texts-reveal';
import { ShimmerText } from '@/components/ui/shimmer-text';
import { SuccessCheck } from '@/components/ui/success-check';
import { ErrorShake } from '@/components/ui/error-shake';
import { ViewTransition, ViewTransitionTrigger, useViewTransition } from '@/components/ui/view-transition';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { ComponentDemoProps } from '../types';

export const NumberRollDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState(128);
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      <div className="font-mono text-3xl font-bold text-primary">
        <NumberRoll value={val} suffix=" words" />
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outlined" onClick={() => setVal((v) => v - 10)}>
          -10 words
        </Button>
        <Button size="sm" variant="filled" onClick={() => setVal((v) => v + 10)}>
          +10 words
        </Button>
      </div>
    </div>
  );
};

export const SpinningCounterDemo: React.FC<ComponentDemoProps> = () => {
  const [count, setCount] = React.useState(42);
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      <div className="font-mono text-2xl font-bold text-on-surface">
        <SpinningCounter value={count} />
      </div>
      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        Increment Daily Count
      </Button>
    </div>
  );
};

export const NumberPopInDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState(98);
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      <div className="font-mono text-3xl font-bold text-success">
        <NumberPopIn value={val} suffix="%" />
      </div>
      <Button size="sm" variant="outlined" onClick={() => setVal((v) => (v === 98 ? 94 : 98))}>
        Simulate Score Change
      </Button>
    </div>
  );
};

export const TextSwapDemo: React.FC<ComponentDemoProps> = () => {
  const [idx, setIdx] = React.useState(0);
  const states = ['Initial Practice', 'Review Needed', 'Goal Completed'];
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      <div className="font-heading text-lg font-bold text-on-surface">
        <TextSwap>{states[idx]}</TextSwap>
      </div>
      <Button size="sm" variant="tonal" onClick={() => setIdx((i) => (i + 1) % states.length)}>
        Cycle Status State
      </Button>
    </div>
  );
};

export const TextsRevealDemo: React.FC<ComponentDemoProps> = () => {
  const [show, setShow] = React.useState(true);

  const handleReplay = () => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
    }, 150);
  };

  return (
    <div className="w-full max-w-md mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-heading text-xs font-bold text-on-surface">Articulation Exercise Steps</span>
        <Button size="sm" variant="tonal" onClick={handleReplay}>
          Replay Sequence
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-surface-container/30 border border-outline-variant/60 min-h-[140px] flex items-center">
        <TextsReveal show={show} className="space-y-2 font-heading text-sm font-semibold text-on-surface">
          <TextsRevealLine index={0}>1. Breath Support & Warm-up</TextsRevealLine>
          <TextsRevealLine index={1}>2. Vowel Sound Prolongation</TextsRevealLine>
          <TextsRevealLine index={2}>3. Consonant Blend Drills</TextsRevealLine>
          <TextsRevealLine index={3}>4. Sentence Practice & Review</TextsRevealLine>
        </TextsReveal>
      </div>
    </div>
  );
};

export const ShimmerTextDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <ShimmerText className="font-heading text-lg font-bold">
        Synthesizing speech practice summary...
      </ShimmerText>
    </div>
  );
};

export const SuccessCheckDemo: React.FC<ComponentDemoProps> = () => {
  const [active, setActive] = React.useState(true);
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <SuccessCheck trigger={active} size={48} />
      <span className="font-label text-xs font-bold text-success">Practice Plan Verified</span>
      <Button size="sm" variant="outlined" onClick={() => setActive(!active)}>
        Re-trigger Animation
      </Button>
    </div>
  );
};

export const ErrorShakeDemo: React.FC<ComponentDemoProps> = () => {
  const [duration, setDuration] = React.useState('75');
  const [error, setError] = React.useState<string | null>(null);
  const [shakeTrigger, setShakeTrigger] = React.useState<number>(0);

  const handleValidate = () => {
    const num = Number(duration);
    if (isNaN(num) || num > 60) {
      setError('Practice duration exceeds recommended maximum (60 minutes)');
      setShakeTrigger((prev) => prev + 1);
    } else if (num <= 0) {
      setError('Practice duration must be greater than 0 minutes');
      setShakeTrigger((prev) => prev + 1);
    } else {
      setError(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6 space-y-4">
      <div className="space-y-1">
        <h4 className="font-heading text-xs font-bold text-on-surface">Practice Session Duration</h4>
        <p className="font-sans text-xs text-on-surface-variant">
          Form micro-shake alert with coordinated error reveals.
        </p>
      </div>

      <ErrorShake
        shake={shakeTrigger}
        errorMessage={error}
        autoRevert={false}
      >
        <div className="space-y-1.5">
          <label htmlFor="duration-input" className="font-label text-xs font-medium text-on-surface block">
            Daily Practice Minutes
          </label>
          <Input
            id="duration-input"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            error={Boolean(error)} aria-invalid={Boolean(error)}
            placeholder="e.g. 15 or 30"
          />
        </div>
      </ErrorShake>

      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleValidate}>
          Verify Duration
        </Button>
        <Button
          size="sm"
          variant="outlined"
          colorRole="neutral"
          onClick={() => {
            setDuration('20');
            setError(null);
            setShakeTrigger(0);
          }}
        >
          Reset to 20 Minutes
        </Button>
      </div>
    </div>
  );
};

export const ViewTransitionDemo: React.FC<ComponentDemoProps> = () => {
  const { isSupported } = useViewTransition();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<'drills' | 'notes'>('drills');

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 py-4 text-left">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-on-surface">
            Same-Document View Transitions
          </h3>
          <Badge
            variant="soft"
            colorRole={isSupported ? 'success' : 'neutral'}
            size="sm"
          >
            {isSupported ? 'Native API Active' : 'Fallback Mode'}
          </Badge>
        </div>
        <p className="font-sans text-xs text-on-surface-variant">
          Orchestrates GPU-accelerated morphs and shared-element transitions between UI states using document.startViewTransition with automatic focus routing and reduced-motion fallback.
        </p>
      </div>

      {/* Interactive Trigger Card with Shared Element Morph */}
      <div className="p-5 rounded-xl bg-surface border border-outline-variant shadow-ambient space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-label text-xs font-semibold text-on-surface-variant">
            Shared-Element Card Morph
          </span>
          <ViewTransitionTrigger
            onTransition={() => setIsExpanded((prev) => !prev)}
            className={cn(
              'text-xs h-8 px-3 rounded-md font-label font-semibold border transition-colors',
              isExpanded
                ? 'bg-secondary-container text-on-secondary-container border-transparent hover:bg-secondary-container/90'
                : 'bg-primary text-on-primary border-transparent hover:bg-primary/90'
            )}
          >
            <Icon name={isExpanded ? 'unfold_less' : 'unfold_more'} size="xs" className="mr-1.5" />
            {isExpanded ? 'Show Summary' : 'Expand Details'}
          </ViewTransitionTrigger>
        </div>

        {/* View Transition Shared Container */}
        <ViewTransition
          name="care-card-morph"
          className="w-full block"
        >
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <Icon name="record_voice_over" size="sm" className="text-primary" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-on-surface">
                    Daily Articulation Practice
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant">
                    Target sounds: /r/ and /s/ consonant blends
                  </p>
                </div>
              </div>
              <Badge variant="soft" colorRole="primary" size="sm">
                94% Accuracy
              </Badge>
            </div>

            {isExpanded && (
              <div className="pt-3 border-t border-outline-variant/60 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                  <div className="p-2.5 rounded-lg bg-surface border border-outline-variant">
                    <span className="font-label text-on-surface-variant block text-[11px]">
                      Completed Exercises
                    </span>
                    <span className="font-heading text-sm font-bold text-on-surface">
                      15 of 15 drills
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface border border-outline-variant">
                    <span className="font-label text-on-surface-variant block text-[11px]">
                      Session Duration
                    </span>
                    <span className="font-heading text-sm font-bold text-on-surface">
                      18 minutes
                    </span>
                  </div>
                </div>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  Patient maintained consistent breath pacing and demonstrated improved clarity when pronouncing multisyllabic target words.
                </p>
              </div>
            )}
          </div>
        </ViewTransition>
      </div>

      {/* Tab Morph Workflow */}
      <div className="p-5 rounded-xl bg-surface border border-outline-variant shadow-ambient space-y-3">
        <span className="font-label text-xs font-semibold text-on-surface-variant block">
          State Switching with Transition Trigger
        </span>
        <div className="flex items-center gap-2">
          <ViewTransitionTrigger
            onTransition={() => setActiveCategory('drills')}
            className={cn(
              'text-xs h-8 px-3 rounded-md font-label font-semibold border transition-colors',
              activeCategory === 'drills'
                ? 'bg-primary text-on-primary border-transparent'
                : 'bg-surface text-on-surface border-outline-variant hover:bg-surface-container'
            )}
          >
            Practice Drills
          </ViewTransitionTrigger>

          <ViewTransitionTrigger
            onTransition={() => setActiveCategory('notes')}
            className={cn(
              'text-xs h-8 px-3 rounded-md font-label font-semibold border transition-colors',
              activeCategory === 'notes'
                ? 'bg-primary text-on-primary border-transparent'
                : 'bg-surface text-on-surface border-outline-variant hover:bg-surface-container'
            )}
          >
            Clinical Notes
          </ViewTransitionTrigger>
        </div>

        <ViewTransition name="category-content-morph" className="w-full block">
          <div className="p-3.5 rounded-lg bg-surface-container border border-outline-variant text-xs font-sans text-on-surface">
            {activeCategory === 'drills' ? (
              <p>Active drills: 3 vowel repetition exercises and 2 multisyllabic reading passages queued.</p>
            ) : (
              <p>Clinical notes: Next review scheduled for Thursday with Dr. Robertson at 10:00 AM.</p>
            )}
          </div>
        </ViewTransition>
      </div>
    </div>
  );
};
