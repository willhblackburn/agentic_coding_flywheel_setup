"use client";

import { motion } from "@/components/motion";
import {
  Search,
  Brain,
  Database,
  Terminal,
  FileText,
  Sparkles,
  Clock,
  Lightbulb,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Plus,
  List,
  Trash2,
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
} from "./lesson-components";

export function SessionMemoryLesson() {
  return (
    <div className="space-y-8">
      <GoalBanner>
        Give your agents persistent memory across sessions.
      </GoalBanner>

      {/* The Memory Problem */}
      <Section
        title="The Memory Problem"
        icon={<Brain className="h-5 w-5" />}
        delay={0.1}
      >
        <Paragraph>
          Claude starts fresh every session. That decision you made last week?
          Gone. The architecture you agreed on? Forgotten.
        </Paragraph>

        <div className="mt-6">
          <MemoryProblemDiagram />
        </div>

        <Paragraph>
          ACFS solves this with two complementary tools:{" "}
          <Highlight>CASS</Highlight> for searching past sessions and{" "}
          <Highlight>CM</Highlight> for storing key facts.
        </Paragraph>
      </Section>

      <Divider />

      {/* CASS: Session Search */}
      <Section
        title="CASS: Session Search"
        icon={<Search className="h-5 w-5" />}
        delay={0.15}
      >
        <Paragraph>
          <Highlight>CASS (Claude Anthropic Session Search)</Highlight> lets you
          search through all your previous Claude Code sessions.
        </Paragraph>

        <div className="mt-6">
          <CodeBlock
            code={`# Search for discussions about authentication
$ cass auth

# Search for API design decisions
$ cass "api endpoint design"

# Search with more context
$ cass --context 10 "database schema"`}
            showLineNumbers
          />
        </div>

        <div className="mt-6">
          <TipBox variant="tip">
            CASS searches the full transcript of every Claude Code session,
            including both your prompts and Claude&apos;s responses.
          </TipBox>
        </div>
      </Section>

      <Divider />

      {/* CASS Output */}
      <Section
        title="Understanding CASS Output"
        icon={<FileText className="h-5 w-5" />}
        delay={0.2}
      >
        <Paragraph>
          When you search with CASS, you get matched excerpts with context:
        </Paragraph>

        <div className="mt-6">
          <CassOutputExample />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <CassFeatureCard
            icon={<Clock className="h-4 w-4" />}
            title="Timestamped"
            description="Know exactly when decisions were made"
          />
          <CassFeatureCard
            icon={<MessageSquare className="h-4 w-4" />}
            title="Full Context"
            description="See the conversation around each match"
          />
        </div>
      </Section>

      <Divider />

      {/* CM: Persistent Memory */}
      <Section
        title="CM: Persistent Memory"
        icon={<Database className="h-5 w-5" />}
        delay={0.25}
      >
        <Paragraph>
          <Highlight>CM (Claude Memory)</Highlight> stores facts and decisions
          that should persist across all sessions.
        </Paragraph>

        <div className="mt-6">
          <MemoryOperationsGrid />
        </div>
      </Section>

      <Divider />

      {/* Using CM */}
      <Section
        title="CM Commands"
        icon={<Terminal className="h-5 w-5" />}
        delay={0.3}
      >
        <div className="space-y-6">
          <CmCommandCard
            title="Add a Memory"
            description="Store a fact or decision for future reference"
            code={`# Add a simple fact
$ cm add "We use PostgreSQL for the main database"

# Add an architectural decision
$ cm add "API uses REST, not GraphQL - decided 2024-01-15"

# Add a project convention
$ cm add "All components go in src/components/ui/"`}
          />

          <CmCommandCard
            title="Search Memories"
            description="Find relevant stored information"
            code={`# Search for database-related memories
$ cm search database

# Search for all API decisions
$ cm search "API"`}
          />

          <CmCommandCard
            title="List All Memories"
            description="See everything stored"
            code={`# List all memories
$ cm list

# List with timestamps
$ cm list --verbose`}
          />

          <CmCommandCard
            title="Clear Memories"
            description="Remove outdated information"
            code={`# Clear a specific memory by ID
$ cm clear 3

# Clear all memories (careful!)
$ cm clear --all`}
          />
        </div>
      </Section>

      <Divider />

      {/* CASS vs CM */}
      <Section
        title="When to Use Each"
        icon={<Lightbulb className="h-5 w-5" />}
        delay={0.35}
      >
        <div className="mt-6">
          <ComparisonTable />
        </div>

        <div className="mt-6">
          <TipBox variant="info">
            Think of CASS as your search history and CM as your sticky notes.
            Use both together for complete memory.
          </TipBox>
        </div>
      </Section>

      <Divider />

      {/* Workflow Example */}
      <Section
        title="Real Workflow"
        icon={<Sparkles className="h-5 w-5" />}
        delay={0.4}
      >
        <Paragraph>
          Here&apos;s how memory tools fit into your development:
        </Paragraph>

        <div className="mt-6">
          <WorkflowSteps />
        </div>
      </Section>

      <Divider />

      {/* Quick Reference */}
      <Section
        title="Quick Reference"
        icon={<Terminal className="h-5 w-5" />}
        delay={0.45}
      >
        <QuickReferenceTable />
      </Section>

      <Divider />

      {/* Try It Now */}
      <Section
        title="Try It Now"
        icon={<CheckCircle2 className="h-5 w-5" />}
        delay={0.5}
      >
        <Paragraph>Practice using session memory:</Paragraph>

        <div className="mt-6">
          <CodeBlock
            code={`# 1. Add a memory about this learning session
$ cm add "Completed ACFS session memory lesson"

# 2. List your memories
$ cm list

# 3. Search your Claude sessions (if any exist)
$ cass "lesson"

# 4. Search memories
$ cm search lesson`}
            showLineNumbers
          />
        </div>

        <div className="mt-6">
          <TipBox variant="tip">
            The more you use CM to store important decisions, the more valuable
            it becomes. Make it a habit to <InlineCode>cm add</InlineCode>{" "}
            after important discussions.
          </TipBox>
        </div>
      </Section>
    </div>
  );
}

// =============================================================================
// MEMORY PROBLEM DIAGRAM
// =============================================================================
function MemoryProblemDiagram() {
  return (
    <div className="relative p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
        {/* Session 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/30">
            <MessageSquare className="h-6 w-6 text-sky-400" />
          </div>
          <span className="text-sm font-medium text-white">Session 1</span>
          <span className="text-xs text-white/50">
            &quot;Use PostgreSQL&quot;
          </span>
        </motion.div>

        {/* Arrow with X */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2"
        >
          <ArrowRight className="h-5 w-5 text-red-400" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
            <span className="text-red-400 font-bold">?</span>
          </div>
          <ArrowRight className="h-5 w-5 text-red-400" />
        </motion.div>

        {/* Session 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <MessageSquare className="h-6 w-6 text-amber-400" />
          </div>
          <span className="text-sm font-medium text-white">Session 2</span>
          <span className="text-xs text-white/50">&quot;What DB?&quot;</span>
        </motion.div>
      </div>

      <p className="text-center text-white/50 text-sm mt-4">
        Without memory tools, context is lost between sessions
      </p>
    </div>
  );
}

// =============================================================================
// CASS OUTPUT EXAMPLE
// =============================================================================
function CassOutputExample() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/60 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-white/40 font-mono">
          cass &quot;database&quot;
        </span>
      </div>
      <div className="p-5 font-mono text-sm space-y-4">
        <div className="space-y-1">
          <div className="text-emerald-400">
            ── 2024-01-15 14:32 ──────────────────
          </div>
          <div className="text-white/50">User: What database should we use?</div>
          <div className="text-white/80">
            Claude: For this project, I recommend <span className="bg-amber-500/30 text-amber-300">PostgreSQL</span>...
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-emerald-400">
            ── 2024-01-18 09:15 ──────────────────
          </div>
          <div className="text-white/50">
            User: Set up the <span className="bg-amber-500/30 text-amber-300">database</span> connection
          </div>
          <div className="text-white/80">
            Claude: I&apos;ll configure the PostgreSQL connection...
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// CASS FEATURE CARD
// =============================================================================
function CassFeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <span className="font-medium text-white">{title}</span>
        <span className="text-sm text-white/50 block">{description}</span>
      </div>
    </div>
  );
}

// =============================================================================
// MEMORY OPERATIONS GRID
// =============================================================================
function MemoryOperationsGrid() {
  const operations = [
    {
      icon: <Plus className="h-5 w-5" />,
      title: "Add",
      description: "Store new facts",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: "Search",
      description: "Find stored info",
      gradient: "from-sky-500/20 to-blue-500/20",
    },
    {
      icon: <List className="h-5 w-5" />,
      title: "List",
      description: "See all memories",
      gradient: "from-violet-500/20 to-purple-500/20",
    },
    {
      icon: <Trash2 className="h-5 w-5" />,
      title: "Clear",
      description: "Remove outdated",
      gradient: "from-rose-500/20 to-red-500/20",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {operations.map((op, i) => (
        <motion.div
          key={op.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`relative p-4 rounded-xl border border-white/[0.08] bg-gradient-to-br ${op.gradient} backdrop-blur-xl text-center`}
        >
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
              {op.icon}
            </div>
          </div>
          <h4 className="font-bold text-white">{op.title}</h4>
          <p className="text-xs text-white/50 mt-1">{op.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

// =============================================================================
// CM COMMAND CARD
// =============================================================================
function CmCommandCard({
  title,
  description,
  code,
}: {
  title: string;
  description: string;
  code: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-3"
    >
      <div>
        <h4 className="font-bold text-white">{title}</h4>
        <p className="text-sm text-white/60">{description}</p>
      </div>
      <CodeBlock code={code} />
    </motion.div>
  );
}

// =============================================================================
// COMPARISON TABLE
// =============================================================================
function ComparisonTable() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-white/[0.06]">
        <div className="p-4 bg-white/[0.02]" />
        <div className="p-4 bg-white/[0.02] text-center">
          <span className="font-bold text-sky-400">CASS</span>
        </div>
        <div className="p-4 bg-white/[0.02] text-center">
          <span className="font-bold text-emerald-400">CM</span>
        </div>
      </div>
      {[
        {
          aspect: "What it stores",
          cass: "Full session transcripts",
          cm: "Individual facts",
        },
        {
          aspect: "How you add",
          cass: "Automatic (all sessions)",
          cm: "Manual (cm add)",
        },
        {
          aspect: "Best for",
          cass: "Finding past discussions",
          cm: "Key decisions & facts",
        },
        {
          aspect: "Search style",
          cass: "Full-text in transcripts",
          cm: "Keyword in memories",
        },
      ].map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.06]"
        >
          <div className="p-4 text-sm font-medium text-white/70">
            {row.aspect}
          </div>
          <div className="p-4 text-sm text-white/60 text-center">{row.cass}</div>
          <div className="p-4 text-sm text-white/60 text-center">{row.cm}</div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// WORKFLOW STEPS
// =============================================================================
function WorkflowSteps() {
  const steps = [
    {
      number: 1,
      title: "Make a decision in a session",
      example: '"Let\'s use JWT for auth"',
    },
    {
      number: 2,
      title: "Store it with CM",
      example: 'cm add "Using JWT for authentication"',
    },
    {
      number: 3,
      title: "Later, search with CASS",
      example: 'cass "auth" to find the full discussion',
    },
    {
      number: 4,
      title: "Or search with CM",
      example: 'cm search auth for quick facts',
    },
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
            {step.number}
          </div>
          <div className="pt-1">
            <h4 className="font-semibold text-white">{step.title}</h4>
            <code className="text-xs text-white/50 font-mono">
              {step.example}
            </code>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// =============================================================================
// QUICK REFERENCE TABLE
// =============================================================================
function QuickReferenceTable() {
  const commands = [
    { command: "cass <query>", description: "Search past sessions" },
    { command: "cass --context 10 <query>", description: "More context lines" },
    { command: 'cm add "fact"', description: "Store a memory" },
    { command: "cm search <query>", description: "Find memories" },
    { command: "cm list", description: "List all memories" },
    { command: "cm clear <id>", description: "Remove a memory" },
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
