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
        <span className="font-mono text-xs text-on-surface-variant">Searching Library</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ThinkingOrb state="solving" size="md" />
        <span className="font-mono text-xs text-on-surface-variant">Analyzing Audio</span>
      </div>
    </div>
  );
};

export const BotAvatarDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-8">
      <div className="flex flex-col items-center gap-2">
        <BotAvatar type="droid" state="working" size="md" />
        <span className="font-mono text-xs text-on-surface-variant">Speech Assistant</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BotAvatar type="cat" state="default" size="md" />
        <span className="font-mono text-xs text-on-surface-variant">Practice Companion</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BotAvatar type="cloud" state="sleeping" size="md" />
        <span className="font-mono text-xs text-on-surface-variant">Audio Monitor</span>
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
          <Trace.Title>Loaded articulation drill set for /r/ vocalic sounds</Trace.Title>
          <Trace.Badge status="complete">200 OK</Trace.Badge>
        </Trace.Line>
        <Trace.Line status="complete">
          <Trace.Icon status="complete" />
          <Trace.Title>Retrieved practice history (accuracy 88%, 5-day streak)</Trace.Title>
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
        Based on baseline accuracy (78%) with initial /s/ blends, starting with picture card prompts before moving to sentence drills.
      </Reasoning>
    </div>
  );
};

export const ChainOfThoughtDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <ChainOfThought defaultOpen>
        <ChainOfThought.Header title="Step-by-Step Exercise Plan" stepCount={2} />
        <ChainOfThought.Content>
          <ChainOfThought.Step title="Review Initial /r/ Words" status="complete">
            Correct tongue position achieved on 8 of 10 trials.
          </ChainOfThought.Step>
          <ChainOfThought.Step title="Practice Word Pairs" status="complete">
            Pacing was steady with clear consonant releases.
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
        <Task.Trigger title="Daily Word Sound Practice" status="running" />
        <Task.Content>
          <Task.Item title="Warm-up Vowel Sounds" status="complete" />
          <Task.Item title="Practice Initial Consonants" status="running" />
          <Task.Item title="Record 3 Review Sentences" status="pending" />
        </Task.Content>
      </Task>
    </div>
  );
};

export const PlanDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <Plan
        title="Weekly Practice Schedule"
        steps={[
          { id: '1', title: 'Complete Syllable Drills', status: 'complete' },
          { id: '2', title: 'Record Voice Practice', status: 'running' },
          { id: '3', title: 'Therapist Progress Review', status: 'pending' },
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
          { id: '1', title: 'Pronunciation Analysis', status: 'complete' },
          { id: '2', title: 'Voice Recording Evaluation', status: 'running' },
        ]}
      />
    </div>
  );
};

export const ClinicianTipDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <ClinicianTip>
        Encourage gentle breaths between repetitions to help learners maintain a relaxed vocal posture.
      </ClinicianTip>
    </div>
  );
};

export const ChatMessageDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-4 space-y-4">
      <ChatMessage
        role="user"
        content="What exercises work best for practicing the vocalic /r/ sound at home?"
      />
      <ChatMessage
        role="assistant"
        botType="droid"
        content='Start with syllable repetition cards (e.g., "ray", "row", "ree") using picture cues. Spend 5 to 10 minutes once daily with immediate audio feedback.'
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
          placeholder="Ask a question about exercises or session notes..."
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
  const code = `// Sound Accuracy Calculation
function calculateAccuracy(correctTrials: number, totalTrials: number): number {
  if (totalTrials === 0) return 0;
  return Math.round((correctTrials / totalTrials) * 100);
}`;
  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <CodeBlock language="typescript">
        <CodeBlock.Header>
          <CodeBlock.Title>accuracy-calculator.ts</CodeBlock.Title>
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
            title="Speech Articulation Practice Guidelines 2026"
            href="https://eolas-speech.org"
            domain="eolas-speech.org"
          />
          <Sources.Item
            title="Paediatric Speech and Language Resources"
            href="https://eolas-speech.org/resources"
            domain="eolas-speech.org"
          />
        </Sources.List>
      </Sources.Root>
    </div>
  );
};

export const InlineCitationDemo: React.FC<ComponentDemoProps> = () => {
  return (
    <div className="w-full max-w-xl mx-auto py-6 text-xs font-sans text-on-surface leading-relaxed">
      Daily home sound practice with audio feedback has been shown to improve articulation clarity by 40%
      <InlineCitation.Badge
        index={1}
        source={{
          title: 'Speech Practice Study 2026',
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
          'Review Vowel Warm-ups',
          'Suggest /r/ Sound Drills',
          'Review Weekly Accuracy',
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
        <Tool.Header name="Speech_Library_Lookup" iconName="database" status="complete" duration="1.2s" />
        <Tool.Content>
          <div className="p-3 text-xs font-mono bg-surface-container rounded-b-lg border-t border-outline-variant/60">
            Lookup status: 200 OK | Learner: P-2024-819 | Plan: Active
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
