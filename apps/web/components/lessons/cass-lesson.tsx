"use client";

import { motion } from "@/components/motion";
import {
  Search,
  History,
  Database,
  Terminal,
  Bot,
  FileSearch,
  Filter,
  Sparkles,
  Book,
  Zap,
} from "lucide-react";
import {
  Section,
  Paragraph,
  CodeBlock,
  TipBox,
  Highlight,
  Divider,
  GoalBanner,
  CommandList,
  FeatureCard,
  FeatureGrid,
} from "./lesson-components";

export function CassLesson() {
  return (
    <div className="space-y-8">
      <GoalBanner>
        Search across all past agent sessions to reuse solved problems.
      </GoalBanner>

      {/* What Is CASS */}
      <Section
        title="What Is CASS?"
        icon={<Search className="h-5 w-5" />}
        delay={0.1}
      >
        <Paragraph>
          <Highlight>CASS (Coding Agent Session Search)</Highlight> indexes all
          your past agent conversations—Claude Code, Codex, Gemini, Cursor, and
          more—so you can find solutions to problems you&apos;ve already solved.
        </Paragraph>
        <Paragraph>
          It&apos;s like having a searchable memory of everything your agents
          have ever done across all projects.
        </Paragraph>

        <div className="mt-8">
          <FeatureGrid>
            <FeatureCard
              icon={<Database className="h-5 w-5" />}
              title="Multi-Agent Index"
              description="Claude, Codex, Gemini, Cursor, ChatGPT sessions"
              gradient="from-primary/20 to-violet-500/20"
            />
            <FeatureCard
              icon={<FileSearch className="h-5 w-5" />}
              title="Full-Text Search"
              description="Search across code, prompts, and responses"
              gradient="from-emerald-500/20 to-teal-500/20"
            />
            <FeatureCard
              icon={<History className="h-5 w-5" />}
              title="Cross-Project"
              description="Find solutions from any project or machine"
              gradient="from-amber-500/20 to-orange-500/20"
            />
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="Fast Retrieval"
              description="Instant results with context snippets"
              gradient="from-blue-500/20 to-indigo-500/20"
            />
          </FeatureGrid>
        </div>
      </Section>

      <Divider />

      {/* Why Use CASS */}
      <Section
        title="Why Use CASS?"
        icon={<Sparkles className="h-5 w-5" />}
        delay={0.15}
      >
        <Paragraph>
          You&apos;ve likely solved many problems before with agents. Without
          CASS:
        </Paragraph>

        <div className="mt-6 space-y-4">
          <UseCaseCard
            problem="You hit an error you've seen before but can't remember the fix"
            solution="Search CASS for the error message → find the exact solution"
          />
          <UseCaseCard
            problem="New project needs auth—you've implemented it before"
            solution="Search 'authentication' → find your past implementation"
          />
          <UseCaseCard
            problem="Different agent solved a similar problem better"
            solution="Search across all agents → find the best approach"
          />
        </div>

        <div className="mt-6">
          <TipBox variant="info">
            CASS helps you avoid re-solving the same problems. Your past agent
            sessions are a goldmine of solutions!
          </TipBox>
        </div>
      </Section>

      <Divider />

      {/* Essential Commands */}
      <Section
        title="Essential Commands"
        icon={<Terminal className="h-5 w-5" />}
        delay={0.2}
      >
        <Paragraph>
          <strong>Important:</strong> Never run bare <code>cass</code>—it
          launches a TUI that may block your session. Always use{" "}
          <code>--robot</code> or <code>--json</code>.
        </Paragraph>

        <div className="mt-6">
          <CommandList
            commands={[
              {
                command: "cass health",
                description: "Check indexing status",
              },
              {
                command: 'cass search "auth error" --robot --limit 5',
                description: "Search with machine-readable output",
              },
              {
                command: "cass view /path/to/session.jsonl -n 42 --json",
                description: "View a specific message",
              },
              {
                command: "cass expand /path/to/session.jsonl -n 42 -C 3 --json",
                description: "View with context (3 messages before/after)",
              },
              {
                command: "cass capabilities --json",
                description: "See what agents are indexed",
              },
              {
                command: "cass robot-docs guide",
                description: "Full documentation for AI agents",
              },
            ]}
          />
        </div>
      </Section>

      <Divider />

      {/* Search Patterns */}
      <Section
        title="Search Patterns"
        icon={<Filter className="h-5 w-5" />}
        delay={0.25}
      >
        <div className="space-y-6">
          <SearchPattern
            title="Basic Search"
            description="Find any mention of a term"
            code='cass search "database migration" --robot'
          />

          <SearchPattern
            title="Filter by Agent"
            description="Only search Claude Code sessions"
            code='cass search "error handling" --agent claude --robot'
          />

          <SearchPattern
            title="Recent Only"
            description="Search last 7 days"
            code='cass search "docker" --days 7 --robot'
          />

          <SearchPattern
            title="Minimal Output"
            description="Just essential fields"
            code='cass search "auth" --robot --fields minimal --limit 10'
          />

          <SearchPattern
            title="Error Messages"
            description="Find solutions to specific errors"
            code='cass search "Cannot read property of undefined" --robot'
          />
        </div>
      </Section>

      <Divider />

      {/* The Search Workflow */}
      <Section
        title="The Search Workflow"
        icon={<Zap className="h-5 w-5" />}
        delay={0.3}
      >
        <SearchWorkflow />
      </Section>

      <Divider />

      {/* Output Format */}
      <Section
        title="Understanding Output"
        icon={<FileSearch className="h-5 w-5" />}
        delay={0.35}
      >
        <Paragraph>
          CASS returns structured results with session info and snippets:
        </Paragraph>

        <div className="mt-6">
          <CodeBlock
            code={`$ cass search "PostgreSQL connection" --robot --limit 2

{
  "results": [
    {
      "session": "/home/ubuntu/.claude-code/sessions/2025-01-14.jsonl",
      "message_number": 87,
      "agent": "claude-code",
      "timestamp": "2025-01-14T15:30:00Z",
      "snippet": "...fixed the PostgreSQL connection by setting pool_size=20...",
      "score": 0.92
    },
    {
      "session": "/home/ubuntu/.codex/sessions/2025-01-12.jsonl",
      "message_number": 45,
      "agent": "codex",
      "timestamp": "2025-01-12T10:15:00Z",
      "snippet": "...PostgreSQL connection string format: postgres://user:pass...",
      "score": 0.85
    }
  ]
}`}
            language="json"
          />
        </div>

        <div className="mt-6">
          <TipBox variant="tip">
            Use <code>cass expand</code> with the session path and message
            number to see the full conversation context!
          </TipBox>
        </div>
      </Section>

      <Divider />

      {/* Best Practices */}
      <Section
        title="Best Practices"
        icon={<Book className="h-5 w-5" />}
        delay={0.4}
      >
        <div className="space-y-4">
          <BestPractice
            title="Use specific search terms"
            description="'PostgreSQL timeout error' is better than just 'error'"
          />
          <BestPractice
            title="Filter by agent for focused results"
            description="If you remember which agent solved it, use --agent"
          />
          <BestPractice
            title="Check multiple solutions"
            description="Different agents may have solved it differently"
          />
          <BestPractice
            title="Use --days for recent context"
            description="Older solutions might use outdated patterns"
          />
        </div>
      </Section>

      <Divider />

      {/* Try It Now */}
      <Section
        title="Try It Now"
        icon={<Terminal className="h-5 w-5" />}
        delay={0.45}
      >
        <CodeBlock
          code={`# Check your indexing status
$ cass health

# Search for a common pattern
$ cass search "import" --robot --limit 3

# View full documentation
$ cass robot-docs guide`}
          showLineNumbers
        />
      </Section>
    </div>
  );
}

// =============================================================================
// USE CASE CARD
// =============================================================================
function UseCaseCard({
  problem,
  solution,
}: {
  problem: string;
  solution: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-red-400">✗</span>
        <p className="text-white/60">{problem}</p>
      </div>
      <div className="flex items-start gap-3">
        <span className="text-emerald-400">✓</span>
        <p className="text-white/80">{solution}</p>
      </div>
    </motion.div>
  );
}

// =============================================================================
// SEARCH PATTERN
// =============================================================================
function SearchPattern({
  title,
  description,
  code,
}: {
  title: string;
  description: string;
  code: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-sm text-white/50">{description}</p>
      </div>
      <CodeBlock code={code} />
    </div>
  );
}

// =============================================================================
// SEARCH WORKFLOW
// =============================================================================
function SearchWorkflow() {
  const steps = [
    {
      icon: <Search className="h-5 w-5" />,
      title: "Search",
      desc: "Find relevant past sessions",
    },
    {
      icon: <FileSearch className="h-5 w-5" />,
      title: "Review",
      desc: "Check snippets and scores",
    },
    {
      icon: <History className="h-5 w-5" />,
      title: "Expand",
      desc: "View full context if needed",
    },
    {
      icon: <Bot className="h-5 w-5" />,
      title: "Apply",
      desc: "Use the solution in your current work",
    },
  ];

  return (
    <div className="relative space-y-4">
      <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-primary/50 via-violet-500/50 to-emerald-500/50" />

      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative flex items-start gap-4 pl-2"
        >
          <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-white shadow-lg shadow-primary/30">
            {step.icon}
          </div>
          <div className="pt-1">
            <h4 className="font-semibold text-white">{step.title}</h4>
            <p className="text-sm text-white/50">{step.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// =============================================================================
// BEST PRACTICE
// =============================================================================
function BestPractice({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5"
    >
      <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-white">{title}</p>
        <p className="text-sm text-white/50">{description}</p>
      </div>
    </motion.div>
  );
}
