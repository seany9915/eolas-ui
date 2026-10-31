import * as React from 'react';
import { NumberRoll } from '@/components/ui/number-roll';
import { SpinningCounter } from '@/components/ui/spinning-counter';
import { NumberPopIn } from '@/components/ui/number-pop-in';
import { TextSwap } from '@/components/ui/text-swap';
import { TextsReveal, TextsRevealLine } from '@/components/ui/texts-reveal';
import { ShimmerText } from '@/components/ui/shimmer-text';
import { SuccessCheck } from '@/components/ui/success-check';
import { ErrorShake } from '@/components/ui/error-shake';
import { ViewTransition } from '@/components/ui/view-transition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
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
    if (isNaN(num) || num > 500) {
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
          onClick={() => {
            setDuration('20');
            setError(null);
          }}
        >
          Reset to 20 Minutes
        </Button>
      </div>
    </div>
  );
};

export const ViewTransitionDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-6 text-center space-y-3">
      <ViewTransition>
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant font-sans text-xs">
          View Transition Primitive (CSS view-transition-name smoothing)
        </div>
      </ViewTransition>
    </div>
  );
};
