"use client";

import { motion } from "@/components/motion";
import {
  Shield,
  Search,
  Bug,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  FileCode,
  Lightbulb,
  Target,
  ArrowRight,
} from "lucide-react";
import {
  Section,
  Paragraph,
  CodeBlock,
  TipBox,
  Highlight,
  Divider,
  GoalBanner,
  InlineCode,
} from "./lesson-components";

export function UbsScanningLesson() {
  return (
    <div className="space-y-8">
      <GoalBanner>
        Master UBS to catch bugs before they reach production.
      </GoalBanner>

      {/* What Is UBS */}
      <Section
        title="What Is UBS?"
        icon={<Shield className="h-5 w-5" />}
        delay={0.1}
      >
        <Paragraph>
          <Highlight>UBS (Ultimate Bug Scanner)</Highlight> is your secret weapon
          for catching bugs early. It runs static analysis on your code and flags
          likely issues before you commit.
        </Paragraph>

        <div className="mt-8">
          <UbsDiagram />
        </div>

        <div className="mt-6">
          <TipBox variant="info">
            <strong>Golden Rule:</strong> Run <InlineCode>ubs</InlineCode> on
            changed files before every commit. Exit 0 = safe. Exit &gt;0 = fix
            and re-run.
          </TipBox>
        </div>
      </Section>

      <Divider />

      {/* Basic Usage */}
      <Section
        title="Basic Usage"
        icon={<Terminal className="h-5 w-5" />}
        delay={0.15}
      >
        <Paragraph>
          UBS is designed to be fast when scoped to specific files:
        </Paragraph>

        <div className="mt-6 space-y-4">
          <CommandCard
            command="ubs file.ts file2.py"
            description="Scan specific files (< 1 second)"
            icon={<FileCode className="h-4 w-4" />}
            recommended
          />
          <CommandCard
            command="ubs $(git diff --name-only --cached)"
            description="Scan staged files before commit"
            icon={<Target className="h-4 w-4" />}
          />
          <CommandCard
            command="ubs --only=js,python src/"
            description="Language filter (3-5x faster)"
            icon={<Zap className="h-4 w-4" />}
          />
          <CommandCard
            command="ubs ."
            description="Whole project (ignores node_modules, .venv)"
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="mt-6">
          <TipBox variant="warning">
            <strong>Speed Critical:</strong> Scope to changed files.{" "}
            <InlineCode>ubs src/file.ts</InlineCode> takes &lt;1s vs{" "}
            <InlineCode>ubs .</InlineCode> at 30s. Never full scan for small
            edits!
          </TipBox>
        </div>
      </Section>

      <Divider />

      {/* Understanding Output */}
      <Section
        title="Understanding the Output"
        icon={<Search className="h-5 w-5" />}
        delay={0.2}
      >
        <Paragraph>
          UBS output follows a consistent format that&apos;s easy to parse:
        </Paragraph>

        <div className="mt-6">
          <CodeBlock
            code={`⚠️  Null Safety (2 errors)
    src/api/users.ts:42:5 – Possible null reference
    💡 Add null check before accessing property

    src/api/users.ts:67:12 – Optional chain recommended
    💡 Use user?.name instead of user.name

Exit code: 1`}
          />
        </div>

        <div className="mt-8">
          <OutputBreakdown />
        </div>
      </Section>

      <Divider />

      {/* Bug Severity */}
      <Section
        title="Bug Severity Levels"
        icon={<AlertTriangle className="h-5 w-5" />}
        delay={0.25}
      >
        <Paragraph>Not all findings are equal. Here&apos;s how to prioritize:</Paragraph>

        <div className="mt-8 space-y-4">
          <SeverityCard
            level="Critical"
            action="Always fix"
            examples={["Null safety", "XSS/injection", "Async/await errors", "Memory leaks"]}
            gradient="from-red-500/20 to-rose-500/20"
            border="border-red-500/30"
          />
          <SeverityCard
            level="Important"
            action="Fix for production"
            examples={["Type narrowing", "Division by zero", "Resource leaks"]}
            gradient="from-amber-500/20 to-orange-500/20"
            border="border-amber-500/30"
          />
          <SeverityCard
            level="Contextual"
            action="Use judgment"
            examples={["TODO/FIXME comments", "Console logs", "Unused variables"]}
            gradient="from-sky-500/20 to-blue-500/20"
            border="border-sky-500/30"
          />
        </div>
      </Section>

      <Divider />

      {/* Fix Workflow */}
      <Section
        title="The Fix Workflow"
        icon={<CheckCircle2 className="h-5 w-5" />}
        delay={0.3}
      >
        <Paragraph>
          When UBS finds issues, follow this systematic approach:
        </Paragraph>

        <div className="mt-8">
          <WorkflowSteps />
        </div>

        <div className="mt-6">
          <TipBox variant="tip">
            <strong>Fix the root cause, not the symptom.</strong> Instead of{" "}
            <InlineCode>if (x) {"{"} x.y {"}"}</InlineCode>, use{" "}
            <InlineCode>x?.y</InlineCode> for optional chaining.
          </TipBox>
        </div>
      </Section>

      <Divider />

      {/* CI Integration */}
      <Section
        title="CI Integration"
        icon={<Zap className="h-5 w-5" />}
        delay={0.35}
      >
        <Paragraph>
          Run UBS in your CI pipeline to catch issues before they merge:
        </Paragraph>

        <div className="mt-6">
          <CodeBlock
            code={`# In your CI config
ubs --ci --fail-on-warning .`}
            language="bash"
          />
        </div>

        <Paragraph>
          The <InlineCode>--ci</InlineCode> flag formats output for CI systems and{" "}
          <InlineCode>--fail-on-warning</InlineCode> ensures warnings also fail the
          build.
        </Paragraph>
      </Section>

      <Divider />

      {/* Anti-Patterns */}
      <Section
        title="Anti-Patterns to Avoid"
        icon={<Bug className="h-5 w-5" />}
        delay={0.4}
      >
        <div className="mt-4 space-y-4">
          <AntiPatternCard
            bad="Ignore findings"
            good="Investigate each one"
            description="Every finding deserves attention, even if it's a false positive"
          />
          <AntiPatternCard
            bad="Full scan per edit"
            good="Scope to changed files"
            description="Speed matters for developer experience"
          />
          <AntiPatternCard
            bad="Fix the symptom"
            good="Fix the root cause"
            description="Don't just silence warnings, understand why they occur"
          />
        </div>
      </Section>

      <Divider />

      {/* Quick Reference */}
      <Section
        title="Quick Reference"
        icon={<Lightbulb className="h-5 w-5" />}
        delay={0.45}
      >
        <QuickReferenceTable />
      </Section>

      <Divider />

      {/* Try It Now */}
      <Section
        title="Try It Now"
        icon={<Terminal className="h-5 w-5" />}
        delay={0.5}
      >
        <CodeBlock
          code={`# Check UBS is installed
$ ubs --help

# Scan a single file
$ ubs /data/projects/myproject/src/index.ts

# Scan your current project
$ ubs .

# View your latest scan session log
$ ubs sessions --entries 1`}
          showLineNumbers
        />
      </Section>
    </div>
  );
}

// =============================================================================
// UBS DIAGRAM - Visual representation of UBS workflow
// =============================================================================
function UbsDiagram() {
  return (
    <div className="relative p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
        <DiagramNode
          icon={<FileCode className="h-6 w-6" />}
          label="Your Code"
          sublabel="Changed files"
          color="from-sky-500 to-blue-500"
          delay={0.1}
        />
        <ArrowRight className="h-5 w-5 text-white/30 hidden md:block" />
        <DiagramNode
          icon={<Shield className="h-6 w-6" />}
          label="UBS Scan"
          sublabel="Static analysis"
          color="from-violet-500 to-purple-500"
          delay={0.2}
        />
        <ArrowRight className="h-5 w-5 text-white/30 hidden md:block" />
        <DiagramNode
          icon={<CheckCircle2 className="h-6 w-6" />}
          label="Clean Code"
          sublabel="Ready to commit"
          color="from-emerald-500 to-teal-500"
          delay={0.3}
        />
      </div>
    </div>
  );
}

function DiagramNode({
  icon,
  label,
  sublabel,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-br ${color} bg-opacity-20 border border-white/[0.1]`}
    >
      <div className="text-white">{icon}</div>
      <div className="text-center">
        <span className="font-bold text-white text-sm block">{label}</span>
        <span className="text-xs text-white/50">{sublabel}</span>
      </div>
    </motion.div>
  );
}

// =============================================================================
// COMMAND CARD - Display a UBS command
// =============================================================================
function CommandCard({
  command,
  description,
  icon,
  recommended,
}: {
  command: string;
  description: string;
  icon: React.ReactNode;
  recommended?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-300 ${
        recommended
          ? "border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
      }`}
    >
      {recommended && (
        <div className="absolute -top-2 right-4 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
          RECOMMENDED
        </div>
      )}
      <div className={`shrink-0 ${recommended ? "text-emerald-400" : "text-primary"}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <code className="text-sm font-mono text-white/90 block truncate">{command}</code>
        <span className="text-xs text-white/50">{description}</span>
      </div>
    </motion.div>
  );
}

// =============================================================================
// OUTPUT BREAKDOWN - Explain the UBS output format
// =============================================================================
function OutputBreakdown() {
  const parts = [
    { label: "file:line:col", description: "Exact location of the issue" },
    { label: "💡", description: "Suggested fix follows" },
    { label: "Exit code: 0", description: "All clear, safe to commit" },
    { label: "Exit code: 1+", description: "Issues found, fix and re-run" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {parts.map((part, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.08] bg-white/[0.02]"
        >
          <code className="px-2 py-1 rounded bg-primary/10 border border-primary/20 text-xs font-mono text-primary whitespace-nowrap">
            {part.label}
          </code>
          <span className="text-sm text-white/60">{part.description}</span>
        </motion.div>
      ))}
    </div>
  );
}

// =============================================================================
// SEVERITY CARD - Bug severity level
// =============================================================================
function SeverityCard({
  level,
  action,
  examples,
  gradient,
  border,
}: {
  level: string;
  action: string;
  examples: string[];
  gradient: string;
  border: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative rounded-2xl border ${border} bg-gradient-to-br ${gradient} p-5 backdrop-blur-xl`}
    >
      <div className="flex items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-bold text-white">{level}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
              {action}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-lg bg-black/20 text-white/70"
              >
                {ex}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// WORKFLOW STEPS - Fix workflow visualization
// =============================================================================
function WorkflowSteps() {
  const steps = [
    { title: "Read finding", description: "Understand the category and fix suggestion" },
    { title: "Navigate to location", description: "Go to file:line:col to view context" },
    { title: "Verify it's real", description: "Is this a real issue or false positive?" },
    { title: "Fix root cause", description: "Don't just silence the warning" },
    { title: "Re-run UBS", description: "Confirm exit code is 0" },
    { title: "Commit", description: "Your code is now clean!" },
  ];

  return (
    <div className="relative space-y-4">
      {/* Connecting line */}
      <div className="absolute left-5 top-8 bottom-8 w-px bg-gradient-to-b from-primary/50 via-white/10 to-emerald-500/50" />

      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative flex items-start gap-4 pl-2"
        >
          <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-white text-sm font-bold shadow-lg shadow-primary/30">
            {i + 1}
          </div>
          <div className="pt-1">
            <h4 className="font-semibold text-white">{step.title}</h4>
            <p className="text-white/50 text-sm">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// =============================================================================
// ANTI-PATTERN CARD - What not to do
// =============================================================================
function AntiPatternCard({
  bad,
  good,
  description,
}: {
  bad: string;
  good: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 overflow-hidden"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-red-400">❌</span>
          <span className="text-sm text-white/70 line-through">{bad}</span>
        </div>
        <ArrowRight className="h-4 w-4 text-white/30" />
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">✓</span>
          <span className="text-sm text-white font-medium">{good}</span>
        </div>
      </div>
      <p className="mt-2 text-xs text-white/50">{description}</p>
    </motion.div>
  );
}

// =============================================================================
// QUICK REFERENCE TABLE
// =============================================================================
function QuickReferenceTable() {
  const commands = [
    { command: "ubs file.ts", description: "Scan specific file" },
    { command: "ubs .", description: "Scan entire project" },
    { command: "ubs --only=js src/", description: "Filter by language" },
    { command: "ubs --ci .", description: "CI-friendly output" },
    { command: "ubs --help", description: "Full command reference" },
    { command: "ubs sessions --entries 1", description: "View latest scan log" },
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
