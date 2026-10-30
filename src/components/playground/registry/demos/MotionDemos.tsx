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
import { Icon } from '@/components/ui/icon';
import { ComponentDemoProps } from '../types';

export const NumberRollDemo: React.FC<ComponentDemoProps> = () => {
  const [val, setVal] = React.useState(128);
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      <div className="font-mono text-3xl font-bold text-primary">
        <NumberRoll value={val} suffix=" bpm" />
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outlined" onClick={() => setVal((v) => v - 10)}>
          -10 bpm
        </Button>
        <Button size="sm" variant="filled" onClick={() => setVal((v) => v + 10)}>
          +10 bpm
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
        Increment Telemetry Pulse
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
        Simulate SpO2 Fluctuation
      </Button>
    </div>
  );
};

export const TextSwapDemo: React.FC<ComponentDemoProps> = () => {
  const [idx, setIdx] = React.useState(0);
  const states = ['Normal Sinus Rhythm', 'Atrial Fibrillation Detected', 'Telemetry Re-syncing'];
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      <div className="font-heading text-lg font-bold text-on-surface">
        <TextSwap>{states[idx]}</TextSwap>
      </div>
      <Button size="sm" variant="tonal" onClick={() => setIdx((i) => (i + 1) % states.length)}>
        Cycle Rhythm State
      </Button>
    </div>
  );
};

export const TextsRevealDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto py-8">
      <TextsReveal className="space-y-1 font-heading text-base font-bold text-on-surface">
        <TextsRevealLine>1. Airway Clearance Confirmed</TextsRevealLine>
        <TextsRevealLine>2. Dual IV Cannulation Established</TextsRevealLine>
        <TextsRevealLine>3. Defibrillator Telemetry Active</TextsRevealLine>
      </TextsReveal>
    </div>
  );
};

export const ShimmerTextDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <ShimmerText className="font-heading text-lg font-bold">
        Clinical AI synthesizing 72-hour longitudinal chart...
      </ShimmerText>
    </div>
  );
};

export const SuccessCheckDemo: React.FC<ComponentDemoProps> = () => {
  const [active, setActive] = React.useState(true);
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <SuccessCheck trigger={active} size={48} />
      <span className="font-label text-xs font-bold text-success">Prescription Verified</span>
      <Button size="sm" variant="outlined" onClick={() => setActive(!active)}>
        Re-trigger Animation
      </Button>
    </div>
  );
};

export const ErrorShakeDemo: React.FC<ComponentDemoProps> = () => {
  const [trigger, setTrigger] = React.useState(false);
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <ErrorShake shake={trigger}>
        <div className="p-4 rounded-xl bg-error-container text-on-error-container font-mono text-xs font-bold border border-error">
          CRITICAL DOSAGE EXCEEDS CEILING
        </div>
      </ErrorShake>
      <Button size="sm" colorRole="error" onClick={() => setTrigger(!trigger)}>
        Trigger Shake Warning
      </Button>
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
