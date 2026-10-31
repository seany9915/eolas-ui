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
        <span className="font-heading text-xs font-bold text-on-surface">Emergency Resuscitation Sequence</span>
        <Button size="sm" variant="tonal" onClick={handleReplay}>
          Replay Sequence
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-surface-container/30 border border-outline-variant/60 min-h-[140px] flex items-center">
        <TextsReveal show={show} className="space-y-2 font-heading text-sm font-semibold text-on-surface">
          <TextsRevealLine index={0}>1. Airway Clearance Confirmed</TextsRevealLine>
          <TextsRevealLine index={1}>2. Dual IV Cannulation Established</TextsRevealLine>
          <TextsRevealLine index={2}>3. Defibrillator Telemetry Active</TextsRevealLine>
          <TextsRevealLine index={3}>4. Emergency Epinephrine 1mg Administered</TextsRevealLine>
        </TextsReveal>
      </div>
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
  const [dosage, setDosage] = React.useState('750');
  const [error, setError] = React.useState<string | null>(null);
  const [shakeTrigger, setShakeTrigger] = React.useState<number>(0);

  const handleValidate = () => {
    const num = Number(dosage);
    if (isNaN(num) || num > 500) {
      setError('Prescribed dosage exceeds maximum recommended ceiling (500mg)');
      setShakeTrigger((prev) => prev + 1);
    } else if (num <= 0) {
      setError('Prescribed dosage must be greater than 0mg');
      setShakeTrigger((prev) => prev + 1);
    } else {
      setError(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6 space-y-4">
      <div className="space-y-1">
        <h4 className="font-heading text-xs font-bold text-on-surface">Prescription Dosage Verification</h4>
        <p className="font-sans text-xs text-on-surface-variant">
          Form micro-shake wrapper adhering to transitions.dev overshoot curve with coordinated error reveals.
        </p>
      </div>

      <ErrorShake
        shake={shakeTrigger}
        errorMessage={error}
        autoRevert={false}
      >
        <div className="space-y-1.5">
          <label htmlFor="dosage-input" className="font-label text-xs font-medium text-on-surface block">
            Amoxicillin Dosage (mg)
          </label>
          <Input
            id="dosage-input"
            type="number"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            error={Boolean(error)} aria-invalid={Boolean(error)}
            placeholder="e.g. 250 or 500"
          />
        </div>
      </ErrorShake>

      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleValidate}>
          Verify Dosage
        </Button>
        <Button
          size="sm"
          variant="outlined"
          onClick={() => {
            setDosage('250');
            setError(null);
          }}
        >
          Reset to Safe (250mg)
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
