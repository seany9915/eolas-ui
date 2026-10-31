import * as React from 'react';
import { ThinkingOrb } from '@/components/ui/thinking-orb';
import { BotAvatar } from '@/components/ui/bot-avatar';
import { Trace } from '@/components/ui/trace';
import { Reasoning } from '@/components/ui/reasoning';
import { ChainOfThought } from '@/components/ui/chain-of-thought';
import { Task } from '@/components/ui/task';
import { Plan } from '@/components/ui/plan';
import { Queue } from '@/components/ui/queue';
import { ClinicianTip } from '@/components/ui/clinician-tip';
import { ChatMessage } from '@/components/ui/chat-message';
import { PromptInput } from '@/components/ui/prompt-input';
import { CodeBlock } from '@/components/ui/code-block';
import { Sources } from '@/components/ui/sources';
import { InlineCitation } from '@/components/ui/inline-citation';
import { SuggestionChips } from '@/components/ui/suggestion-chips';
import { ModelSelector, type ThinkingEffort } from '@/components/ui/model-selector';
import { Tool } from '@/components/ui/tool';
import { Checkpoint } from '@/components/ui/checkpoint';
import { ComponentDemoProps } from '../types';

export const ThinkingOrbDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-8">
      <div className="flex flex-col items-center gap-2">
        <ThinkingOrb state="working" size="md" />
        <span className="font-mono text-xs text-on-surface-variant">Working</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThinkingOrb state="searching" size="md" />
        <span className="font-mono text-xs text-on-surface-variant">Searching EHR</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThinkingOrb state="solving" size="md" />
        <span className="font-mono text-xs text-on-surface-variant">Solving Dose</span>
      </div>
    </div>
  );
};

export const BotAvatarDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-8">
      <div className="flex flex-col items-center gap-2">
        <BotAvatar type="droid" state="working" size="md" />
        <span className="font-mono text-xs text-on-surface-variant">Clinical Droid</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BotAvatar type="cat" state="default" size="md" />
        <span className="font-mono text-xs text-on-surface-variant">Paediatric Companion</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BotAvatar type="cloud" state="sleeping" size="md" />
        <span className="font-mono text-xs text-on-surface-variant">Night Telemetry</span>
      </div>
    </div>
  );
};

export const TraceDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <Trace>
        <Trace.Line status="complete">
          <Trace.Icon status="complete" />
          <Trace.Title>Queried NHS Digital Spine ICD-10 registry for J45.0 (Asthma)</Trace.Title>
          <Trace.Badge status="complete">200 OK</Trace.Badge>
        </Trace.Line>
        <Trace.Line status="complete">
          <Trace.Icon status="complete" />
          <Trace.Title>Retrieved recent blood gas chemistry (pH 7.38, pCO2 42)</Trace.Title>
          <Trace.Badge status="complete">Done</Trace.Badge>
        </Trace.Line>
      </Trace>
    </div>
  );
};

export const ReasoningDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <Reasoning duration="1.8s">
        Given patient weight (14 kg) and documented acute status asthmaticus, Salbutamol nebulisation dose is calculated at 2.5 mg every 20 minutes for the first hour.
      </Reasoning>
    </div>
  );
};

export const ChainOfThoughtDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <ChainOfThought defaultOpen>
        <ChainOfThought.Header title="Multi-Step Diagnostic Evaluation" stepCount={2} />
        <ChainOfThought.Content>
          <ChainOfThought.Step title="Assess Airway & Work of Breathing" status="complete">
            Bilateral wheezing noted. Moderate subcostal retractions present.
          </ChainOfThought.Step>
          <ChainOfThought.Step title="Check Renal Function Baseline" status="complete">
            Serum creatinine 44 umol/L (within normal age bounds).
          </ChainOfThought.Step>
        </ChainOfThought.Content>
      </ChainOfThought>
    </div>
  );
};

export const TaskDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <Task defaultOpen>
        <Task.Trigger title="Administer Bronchodilator Protocol" status="running" />
        <Task.Content>
          <Task.Item title="Check Patient Identity & Bay" status="complete" />
          <Task.Item title="Deliver Nebulised Salbutamol 2.5mg" status="running" />
          <Task.Item title="Re-assess SpO2 and Heart Rate" status="pending" />
        </Task.Content>
      </Task>
    </div>
  );
};

export const PlanDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <Plan
        title="Paediatric ICU Admission Strategy"
        steps={[
          { id: '1', title: 'Transfer to Bed Bay 03', status: 'complete' },
          { id: '2', title: 'Initiate Continuous Telemetry', status: 'running' },
          { id: '3', title: 'Pediatric Consultant Sign-Off', status: 'pending' },
        ]}
      />
    </div>
  );
};

export const QueueDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <Queue
        items={[
          { id: '1', title: 'FBC Lab Panel Analysis', status: 'complete' },
          { id: '2', title: 'Bedside Ultrasound Echo', status: 'running' },
        ]}
      />
    </div>
  );
};

export const ClinicianTipDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <ClinicianTip>
        Always check recent serum potassium prior to intravenous Salbutamol administration to prevent hypokalaemic cardiac arrhythmias.
      </ClinicianTip>
    </div>
  );
};

export const ChatMessageDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4 space-y-4">
      <ChatMessage
        role="user"
        content="What is the recommended starting dose of Prednisolone for a 14kg child with acute exacerbation?"
      />
      <ChatMessage
        role="assistant"
        botType="droid"
        content="Under BNF for Children (BNFC) guidelines, oral Prednisolone is dosed at 1 to 2 mg/kg (maximum 40 mg). For a 14kg child, this corresponds to 14 mg to 28 mg once daily for 3 days."
      />
    </div>
  );
};

export const PromptInputDemo: React.FC<ComponentDemoProps> = () => {
  const [text, setText] = React.useState('');
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <PromptInput.Root>
        <PromptInput.Textarea
          placeholder="Ask a clinical question or summarize longitudinal notes..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <PromptInput.Actions>
          <PromptInput.AttachButton />
          <PromptInput.Submit disabled={!text} />
        </PromptInput.Actions>
      </PromptInput.Root>
    </div>
  );
};

export const CodeBlockDemo: React.FC<ComponentDemoProps> = () => {
  const code = `// Clinical Dosage Algorithm
function calculateDose(weightKg: number, mgPerKg: number): number {
  const maxSafeDoseMg = 40;
  return Math.min(weightKg * mgPerKg, maxSafeDoseMg);
}`;
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <CodeBlock language="typescript">
        <CodeBlock.Header>
          <CodeBlock.Title>dosage-algorithm.ts</CodeBlock.Title>
          <CodeBlock.CopyButton value={code} />
        </CodeBlock.Header>
        <CodeBlock.Content>{code}</CodeBlock.Content>
      </CodeBlock>
    </div>
  );
};

export const SourcesDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <Sources.Root>
        <Sources.List>
          <Sources.Item
            title="NICE Clinical Guideline CG54: Neonatal Resuscitation"
            href="https://nice.org.uk"
            domain="nice.org.uk"
          />
          <Sources.Item
            title="British National Formulary for Children (BNFC) 2026"
            href="https://bnf.nice.org.uk"
            domain="bnf.nice.org.uk"
          />
        </Sources.List>
      </Sources.Root>
    </div>
  );
};

export const InlineCitationDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-6 text-xs font-sans text-on-surface leading-relaxed">
      Continuous pulse oximetry monitoring has been shown to reduce undetected hypoxic events by 78%
      <InlineCitation.Badge
        index={1}
        source={{
          title: 'NICE Monitoring Guidance 2026',
          url: 'https://nice.org.uk',
          domain: 'nice.org.uk',
        }}
      />.
    </div>
  );
};

export const SuggestionChipsDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <SuggestionChips
        suggestions={[
          'Check Renal Function Baseline',
          'Calculate Paediatric Salbutamol Dose',
          'Review Critical Lab Alerts',
        ]}
        onSelect={() => {}}
      />
    </div>
  );
};

export const ModelSelectorDemo: React.FC<ComponentDemoProps> = () => {
  const [model, setModel] = React.useState('gemini-2.5-pro');
  const [effort, setEffort] = React.useState<ThinkingEffort>('medium');
  return (
    <div className="w-full max-w-sm mx-auto py-4 flex justify-center">
      <ModelSelector.Root>
        <ModelSelector.Model value={model} onValueChange={setModel} />
        <ModelSelector.Effort value={effort} onValueChange={setEffort} />
      </ModelSelector.Root>
    </div>
  );
};

export const ToolDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <Tool.Root status="complete">
        <Tool.Header name="NHS_Spine_EHR_Lookup" iconName="database" status="complete" duration="1.2s" />
        <Tool.Content>
          <div className="p-3 text-xs font-mono bg-surface-container rounded-b-lg border-t border-outline-variant/60">
            Lookup status: 200 OK | Patient: NHS# 882-102-491 | Allergies: Verified
          </div>
        </Tool.Content>
      </Tool.Root>
    </div>
  );
};

export const CheckpointDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <Checkpoint
        label="Conversation checkpoint created"
        turn={4}
        onRestore={() => {}}
      />
    </div>
  );
};
