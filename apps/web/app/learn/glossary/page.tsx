"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Home,
  Lightbulb,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAllTerms, type JargonTerm } from "@/lib/jargon";

// Group terms by first letter
function groupByLetter(terms: JargonTerm[]): Record<string, JargonTerm[]> {
  const groups: Record<string, JargonTerm[]> = {};

  for (const term of terms) {
    const firstChar = term.term[0].toUpperCase();
    // Group numbers and special chars under #
    const key = /[A-Z]/.test(firstChar) ? firstChar : "#";
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(term);
  }

  // Sort terms within each group
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => a.term.localeCompare(b.term));
  }

  return groups;
}

function TermCard({ term }: { term: JargonTerm }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      id={term.term.toLowerCase().replace(/\s+/g, "-")}
      className="scroll-mt-24"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group w-full text-left"
      >
        <div className="rounded-lg border border-border/50 bg-card/50 p-4 transition-colors hover:border-primary/30 hover:bg-card/80">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{term.term}</h3>
                <ChevronRight
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {term.short}
              </p>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 space-y-3 border-t border-border/30 pt-4">
              <p className="text-sm leading-relaxed text-foreground">
                {term.long}
              </p>

              {term.analogy && (
                <div className="rounded-lg bg-primary/5 p-3">
                  <p className="text-xs font-medium text-primary mb-1">
                    Think of it like...
                  </p>
                  <p className="text-sm text-muted-foreground">{term.analogy}</p>
                </div>
              )}

              {term.why && (
                <div className="rounded-lg bg-emerald-500/5 p-3">
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                    Why we use it
                  </p>
                  <p className="text-sm text-muted-foreground">{term.why}</p>
                </div>
              )}

              {term.related && term.related.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Related terms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {term.related.map((rel) => (
                      <a
                        key={rel}
                        href={`#${rel.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-full border border-border/50 bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-primary"
                      >
                        {rel}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const allTerms = useMemo(() => getAllTerms(), []);

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return allTerms;

    const query = searchQuery.toLowerCase();
    return allTerms.filter(
      (term) =>
        term.term.toLowerCase().includes(query) ||
        term.short.toLowerCase().includes(query) ||
        term.long.toLowerCase().includes(query)
    );
  }, [allTerms, searchQuery]);

  const groupedTerms = useMemo(
    () => groupByLetter(filteredTerms),
    [filteredTerms]
  );

  const sortedLetters = useMemo(
    () => Object.keys(groupedTerms).sort((a, b) => {
      if (a === "#") return -1;
      if (b === "#") return 1;
      return a.localeCompare(b);
    }),
    [groupedTerms]
  );

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-cosmic opacity-50" />
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-20" />

      <div className="relative mx-auto max-w-4xl px-6 py-8 md:px-12 md:py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/learn"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Learning Hub</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="text-sm">Home</span>
          </Link>
        </div>

        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
            Glossary
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Plain-language definitions for all the technical terms used
            throughout the setup wizard and learning hub.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {allTerms.length} terms defined
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search glossary terms"
            className="w-full rounded-xl border border-border/50 bg-card/50 py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Alphabet quick nav */}
        <div className="mb-8 flex flex-wrap justify-center gap-1">
          {sortedLetters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-mono font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Terms by letter */}
        <div className="space-y-8">
          {sortedLetters.length > 0 ? (
            sortedLetters.map((letter) => (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-8">
                <div className="sticky top-0 z-10 mb-4 flex items-center gap-3 bg-background/80 py-2 backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-mono text-lg font-bold text-primary">
                    {letter}
                  </div>
                  <div className="h-px flex-1 bg-border/50" />
                  <span className="text-xs text-muted-foreground">
                    {groupedTerms[letter].length} term
                    {groupedTerms[letter].length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-3">
                  {groupedTerms[letter].map((term) => (
                    <TermCard key={term.term} term={term} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                No terms match your search.
              </p>
            </div>
          )}
        </div>

        {/* Related links */}
        <Card className="mt-10 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="h-5 w-5 text-primary" />
            Related References
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/learn/agent-commands"
              className="flex items-center gap-3 rounded-lg border border-border/50 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <Lightbulb className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Agent Commands</div>
                <div className="text-sm text-muted-foreground">
                  Claude, Codex, Gemini reference
                </div>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/learn/ntm-palette"
              className="flex items-center gap-3 rounded-lg border border-border/50 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <Lightbulb className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">NTM Commands</div>
                <div className="text-sm text-muted-foreground">
                  Session management reference
                </div>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Back to{" "}
            <Link href="/learn" className="text-primary hover:underline">
              Learning Hub &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
