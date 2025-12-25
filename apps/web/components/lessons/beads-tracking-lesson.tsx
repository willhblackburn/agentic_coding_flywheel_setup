"use client";

import { motion } from "@/components/motion";
import {
  CircleDot,
  GitBranch,
  Terminal,
  ListTodo,
  CheckCircle2,
  AlertCircle,
  Target,
  Sparkles,
  Eye,
  Link2,
  RefreshCw,
  Zap,
} from "lucide-react";
import {
  Section,
  Paragraph,
  CodeBlock,
  TipBox,
  Divider,
  GoalBanner,
  Highlight,
  InlineCode,
  BulletList,
} from "./lesson-components";

export function BeadsTrackingLesson() {
  return (
    <div className="space-y-8">
      <GoalBanner>
        Track work with git-backed issue management.
      </GoalBanner>

      {/* What Are Beads? */}
      <Section
        title="What Are Beads?"
        icon={<CircleDot className="h-5 w-5" />}
        delay={0.1}
      >
        <Paragraph>
          <Highlight>Beads</Highlight> is a lightweight issue tracking system
          that lives in your git repository. No external services, no context
          switching—just files that sync with your code.
        </Paragraph>

        <div className="mt-6">
          <BeadsConceptDiagram />
        </div>

        <div className="mt-6">
          <BulletList
            items={[
              "Issues stored as YAML files in .beads/",
              "Syncs automatically with git push/pull",
              "Works offline, no account needed",
              "Perfect for AI agent workflows",
            ]}
          />
        </div>
      </Section>

      <Divider />

      {/* Two Tools */}
      <Section
        title="Two Commands"
        icon={<Terminal className="h-5 w-5" />}
        delay={0.15}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ToolCard
            command="bd"
            title="Beads CLI"
            description="Create, update, close, and manage issues"
            gradient="from-primary/20 to-violet-500/20"
          />
          <ToolCard
            command="bv"
            title="Beads Viewer"
            description="Interactive TUI for browsing issues"
            gradient="from-emerald-500/20 to-teal-500/20"
          />
        </div>
      </Section>

      <Divider />

      {/* Finding Work */}
      <Section
        title="Finding Work"
        icon={<Target className="h-5 w-5" />}
        delay={0.2}
      >
        <Paragraph>
          Start every session by checking what&apos;s ready to work on:
        </Paragraph>

        <div className="mt-6">
          <CodeBlock
            code={`# Show issues ready to work (no blockers)
$ bd ready

# All open issues
$ bd list --status=open

# Issues currently in progress
$ bd list --status=in_progress

# View a specific issue
$ bd show beads-123`}
            showLineNumbers
          />
        </div>

        <div className="mt-6">
          <TipBox variant="tip">
            <InlineCode>bd ready</InlineCode> is your go-to command. It shows
            only issues that have no blockers—what you can actually work on now.
          </TipBox>
        </div>
      </Section>

      <Divider />

      {/* Creating Issues */}
      <Section
        title="Creating Issues"
        icon={<ListTodo className="h-5 w-5" />}
        delay={0.25}
      >
        <Paragraph>Create issues with type and priority:</Paragraph>

        <div className="mt-6">
          <CodeBlock
            code={`# Create a feature request
$ bd create --title="Add dark mode" --type=feature --priority=2

# Create a bug report
$ bd create --title="Login fails on Safari" --type=bug --priority=1

# Create a task
$ bd create --title="Update dependencies" --type=task --priority=3`}
            showLineNumbers
          />
        </div>

        <div className="mt-6">
          <PriorityLevelsGrid />
        </div>

        <div className="mt-6">
          <TipBox variant="warning">
            Priority uses numbers 0-4 (or P0-P4), NOT words like
            &quot;high&quot; or &quot;low&quot;. P0 is most critical, P4 is
            backlog.
          </TipBox>
        </div>
      </Section>

      <Divider />

      {/* Working on Issues */}
      <Section
        title="Working on Issues"
        icon={<Zap className="h-5 w-5" />}
        delay={0.3}
      >
        <Paragraph>Claim and complete work:</Paragraph>

        <div className="mt-6 space-y-6">
          <WorkflowStep
            number={1}
            title="Claim the issue"
            code="bd update beads-123 --status=in_progress"
          />
          <WorkflowStep
            number={2}
            title="Do the work"
            code="# Write your code, run tests, etc."
          />
          <WorkflowStep
            number={3}
            title="Close when done"
            code='bd close beads-123 --reason="Implemented in commit abc123"'
          />
        </div>
      </Section>

      <Divider />

      {/* Dependencies */}
      <Section
        title="Dependencies & Blocking"
        icon={<Link2 className="h-5 w-5" />}
        delay={0.35}
      >
        <Paragraph>
          Beads tracks what blocks what—so you don&apos;t work on things out of
          order:
        </Paragraph>

        <div className="mt-6">
          <CodeBlock
            code={`# Add a dependency: tests depend on feature
$ bd dep add beads-456 beads-123
# beads-456 (tests) now waits for beads-123 (feature)

# See what's blocked
$ bd blocked

# See what blocks a specific issue
$ bd show beads-456`}
            showLineNumbers
          />
        </div>

        <div className="mt-6">
          <DependencyDiagram />
        </div>
      </Section>

      <Divider />

      {/* Syncing */}
      <Section
        title="Syncing with Git"
        icon={<RefreshCw className="h-5 w-5" />}
        delay={0.4}
      >
        <Paragraph>
          Beads changes sync with git. Run at session end:
        </Paragraph>

        <div className="mt-6">
          <CodeBlock
            code={`# Sync beads with remote
$ bd sync

# Check sync status without syncing
$ bd sync --status`}
          />
        </div>

        <div className="mt-6">
          <TipBox variant="info">
            Beads hooks automatically sync during git operations. Manual sync is
            mainly for session boundaries.
          </TipBox>
        </div>
      </Section>

      <Divider />

      {/* Interactive Viewer */}
      <Section
        title="Interactive Viewer"
        icon={<Eye className="h-5 w-5" />}
        delay={0.45}
      >
        <Paragraph>
          <InlineCode>bv</InlineCode> opens a terminal UI for browsing issues:
        </Paragraph>

        <div className="mt-6">
          <BvViewerPreview />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <KeyboardShortcut keys="j/k" action="Navigate up/down" />
          <KeyboardShortcut keys="Enter" action="View issue details" />
          <KeyboardShortcut keys="f" action="Filter issues" />
          <KeyboardShortcut keys="q" action="Quit viewer" />
        </div>
      </Section>

      <Divider />

      {/* Quick Reference */}
      <Section
        title="Quick Reference"
        icon={<Sparkles className="h-5 w-5" />}
        delay={0.5}
      >
        <QuickReferenceTable />
      </Section>

      <Divider />

      {/* Try It Now */}
      <Section
        title="Try It Now"
        icon={<CheckCircle2 className="h-5 w-5" />}
        delay={0.55}
      >
        <Paragraph>Practice the beads workflow:</Paragraph>

        <div className="mt-6">
          <CodeBlock
            code={`# 1. Check project health
$ bd doctor

# 2. See project statistics
$ bd stats

# 3. List what's ready to work on
$ bd ready

# 4. Open the interactive viewer
$ bv`}
            showLineNumbers
          />
        </div>

        <div className="mt-6">
          <TipBox variant="tip">
            Use <InlineCode>bd ready</InlineCode> at the start of every session
            to see available work. It&apos;s your mission briefing.
          </TipBox>
        </div>
      </Section>
    </div>
  );
}

// =============================================================================
// BEADS CONCEPT DIAGRAM
// =============================================================================
function BeadsConceptDiagram() {
  return (
    <div className="relative p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-primary/10 to-violet-500/10 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {/* Code */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30">
            <Terminal className="h-6 w-6 text-sky-400" />
          </div>
          <span className="text-sm font-medium text-white">Your Code</span>
        </motion.div>

        {/* Plus */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-white/30"
        >
          +
        </motion.div>

        {/* Beads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 border border-primary/30">
            <CircleDot className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm font-medium text-white">.beads/</span>
        </motion.div>

        {/* Equals */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold text-white/30"
        >
          =
        </motion.div>

        {/* Git */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
            <GitBranch className="h-6 w-6 text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-white">Synced Together</span>
        </motion.div>
      </div>
    </div>
  );
}

// =============================================================================
// TOOL CARD
// =============================================================================
function ToolCard({
  command,
  title,
  description,
  gradient,
}: {
  command: string;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br ${gradient} backdrop-blur-xl`}
    >
      <code className="inline-block px-3 py-1.5 rounded-lg bg-black/30 border border-white/[0.1] text-xl font-mono font-bold text-white mb-3">
        {command}
      </code>
      <h4 className="font-bold text-white text-lg">{title}</h4>
      <p className="text-sm text-white/60 mt-1">{description}</p>
    </motion.div>
  );
}

// =============================================================================
// PRIORITY LEVELS GRID
// =============================================================================
function PriorityLevelsGrid() {
  const priorities = [
    { level: "P0", label: "Critical", color: "text-red-400", bg: "bg-red-500/20" },
    { level: "P1", label: "High", color: "text-orange-400", bg: "bg-orange-500/20" },
    { level: "P2", label: "Medium", color: "text-amber-400", bg: "bg-amber-500/20" },
    { level: "P3", label: "Low", color: "text-sky-400", bg: "bg-sky-500/20" },
    { level: "P4", label: "Backlog", color: "text-white/50", bg: "bg-white/10" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {priorities.map((p) => (
        <div
          key={p.level}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${p.bg} border border-white/[0.08]`}
        >
          <span className={`font-mono font-bold ${p.color}`}>{p.level}</span>
          <span className="text-sm text-white/60">{p.label}</span>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// WORKFLOW STEP
// =============================================================================
function WorkflowStep({
  number,
  title,
  code,
}: {
  number: number;
  title: string;
  code: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: number * 0.1 }}
      className="relative flex items-start gap-4"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-white text-sm font-bold shadow-lg shadow-primary/30">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-white mb-2">{title}</h4>
        <div className="rounded-xl bg-black/40 border border-white/[0.08] p-3">
          <code className="text-sm font-mono text-emerald-400">{code}</code>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// DEPENDENCY DIAGRAM
// =============================================================================
function DependencyDiagram() {
  return (
    <div className="relative p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        {/* Feature Issue */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
            <div className="text-xs text-emerald-400 font-mono">beads-123</div>
            <div className="text-sm font-medium text-white">Add feature</div>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">Ready</span>
            </div>
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 text-white/30"
        >
          <div className="h-px w-8 bg-white/30" />
          <span className="text-xs">blocks</span>
          <div className="h-px w-8 bg-white/30" />
        </motion.div>

        {/* Test Issue */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <div className="text-xs text-amber-400 font-mono">beads-456</div>
            <div className="text-sm font-medium text-white">Write tests</div>
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3 text-amber-400" />
              <span className="text-xs text-amber-400">Blocked</span>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-white/50 text-sm mt-4">
        beads-456 waits for beads-123 to complete
      </p>
    </div>
  );
}

// =============================================================================
// BV VIEWER PREVIEW
// =============================================================================
function BvViewerPreview() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/60 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-white/40 font-mono">bv</span>
      </div>
      <div className="p-4 font-mono text-sm">
        <div className="text-primary mb-2">Beads Viewer - 5 issues</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded">
            <span className="text-emerald-400">●</span>
            <span className="text-white/80">beads-001</span>
            <span className="text-white/50">Add dark mode</span>
            <span className="text-amber-400 ml-auto">P2</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="text-sky-400">●</span>
            <span className="text-white/80">beads-002</span>
            <span className="text-white/50">Fix login bug</span>
            <span className="text-orange-400 ml-auto">P1</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="text-amber-400">○</span>
            <span className="text-white/80">beads-003</span>
            <span className="text-white/50">Update docs</span>
            <span className="text-white/40 ml-auto">P4</span>
          </div>
        </div>
        <div className="text-white/30 mt-3">j/k: navigate | Enter: view | q: quit</div>
      </div>
    </div>
  );
}

// =============================================================================
// KEYBOARD SHORTCUT
// =============================================================================
function KeyboardShortcut({
  keys,
  action,
}: {
  keys: string;
  action: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.08] bg-white/[0.02]">
      <kbd className="px-2.5 py-1 rounded-lg bg-black/30 border border-white/[0.1] text-sm font-mono text-white">
        {keys}
      </kbd>
      <span className="text-sm text-white/60">{action}</span>
    </div>
  );
}

// =============================================================================
// QUICK REFERENCE TABLE
// =============================================================================
function QuickReferenceTable() {
  const commands = [
    { command: "bd ready", description: "Show issues ready to work" },
    { command: "bd list --status=open", description: "All open issues" },
    { command: "bd show <id>", description: "View issue details" },
    { command: 'bd create --title="..." --type=task', description: "Create issue" },
    { command: "bd update <id> --status=in_progress", description: "Claim work" },
    { command: "bd close <id>", description: "Complete issue" },
    { command: "bd dep add <issue> <depends-on>", description: "Add dependency" },
    { command: "bd sync", description: "Sync with git" },
    { command: "bd stats", description: "Project statistics" },
    { command: "bv", description: "Open interactive viewer" },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
      <div className="grid grid-cols-[1fr_1fr] divide-x divide-white/[0.06]">
        <div className="p-3 bg-white/[0.02] text-sm font-medium text-white/60">
          Command
        </div>
        <div className="p-3 bg-white/[0.02] text-sm font-medium text-white/60">
          What it does
        </div>
      </div>
      {commands.map((cmd, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_1fr] divide-x divide-white/[0.06] border-t border-white/[0.06]"
        >
          <div className="p-3">
            <code className="text-xs font-mono text-primary">{cmd.command}</code>
          </div>
          <div className="p-3 text-sm text-white/70">{cmd.description}</div>
        </div>
      ))}
    </div>
  );
}
