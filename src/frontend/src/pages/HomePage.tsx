import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Flame,
  Globe2,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import type { Language, LanguageProgress } from "../backend.d";
import { languageCountryInfo } from "../data/sampleData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllUserProgress,
  useLanguages,
  useProfile,
} from "../hooks/useQueries";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function LanguageCard({
  language,
  progress,
  index,
}: {
  language: Language;
  progress?: LanguageProgress | null;
  index: number;
}) {
  const navigate = useNavigate();
  const xp = progress ? Number(progress.totalXP) : 0;
  const lessonsCount = progress ? progress.lessonsCompleted.length : 0;
  const info = languageCountryInfo[language.code] ?? {
    country: language.name,
    description: "Explore this beautiful language",
    learners: "—",
  };

  const progressPercent = Math.min(100, (lessonsCount / 30) * 100);

  return (
    <motion.div variants={cardVariants}>
      <button
        type="button"
        onClick={() =>
          navigate({
            to: "/language/$languageId",
            params: { languageId: language.id },
          })
        }
        className="lang-card w-full text-left bg-card rounded-2xl p-5 border border-border shadow-card group block"
        data-ocid={`language.card.${index}`}
        aria-label={`Learn ${language.name}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span
              className="text-4xl leading-none"
              role="img"
              aria-label={language.name}
            >
              {language.flag}
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground leading-tight">
                {language.name}
              </h3>
              <p className="text-xs text-muted-foreground font-accent mt-0.5">
                {info.country}
              </p>
            </div>
          </div>
          {xp > 0 && (
            <Badge
              variant="secondary"
              className="text-xs bg-primary/10 text-primary border-primary/20 font-accent font-semibold shrink-0"
            >
              {xp.toLocaleString()} XP
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-4 font-body leading-relaxed">
          {info.description}
        </p>

        {lessonsCount > 0 ? (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs text-muted-foreground font-accent">
              <span>{lessonsCount} words learned</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="progress-track h-2 rounded-full overflow-hidden">
              <div
                className="progress-fill h-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-primary font-accent font-medium group-hover:gap-3 transition-all">
            <span>Start learning</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        )}
      </button>
    </motion.div>
  );
}

function LanguageCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-3 w-full mb-1.5" />
      <Skeleton className="h-3 w-3/4 mb-4" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

export default function HomePage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: languages, isLoading: langLoading } = useLanguages();
  const { data: profile } = useProfile();
  const { data: allProgress } = useAllUserProgress();

  const isAuthenticated = !!identity;

  const progressMap = new Map<string, LanguageProgress>();
  if (allProgress) {
    for (const [langId, prog] of allProgress) {
      progressMap.set(langId, prog);
    }
  }

  const hasProgress = allProgress && allProgress.length > 0;
  const username = profile?.username ?? "Explorer";
  const streak = profile ? Number(profile.currentStreak) : 0;
  const totalXP = profile ? Number(profile.xp) : 0;

  return (
    <div className="page-enter" data-ocid="home.page">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-mesh py-16 sm:py-24 px-4">
        {/* Decorative background blobs */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "oklch(0.35 0.12 152)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "oklch(0.72 0.16 55)" }}
        />

        <div className="container mx-auto max-w-4xl relative">
          {isAuthenticated && profile ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-accent font-semibold mb-6 border border-primary/20">
                <Star className="w-4 h-4" />
                Welcome back, {username}!
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-6xl text-foreground mb-4 tracking-tight">
                Keep Learning,{" "}
                <span className="text-lingua-amber">Keep Growing</span>
              </h1>
              <p className="text-muted-foreground text-lg font-body mb-8 max-w-xl mx-auto">
                Your language journey continues. Every word gets you closer to
                fluency.
              </p>

              {/* Stats row */}
              <div className="flex items-center justify-center gap-4 sm:gap-8 mb-10 flex-wrap">
                <div className="flex items-center gap-2.5 bg-card rounded-xl px-5 py-3 border border-border shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-lingua-amber/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-lingua-amber" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-display font-bold text-foreground leading-none">
                      {totalXP.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground font-accent">
                      Total XP
                    </p>
                  </div>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-2.5 bg-card rounded-xl px-5 py-3 border border-border shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-lingua-coral/20 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-lingua-coral" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-display font-bold text-foreground leading-none streak-pulse">
                        {streak}
                      </p>
                      <p className="text-xs text-muted-foreground font-accent">
                        Day Streak
                      </p>
                    </div>
                  </div>
                )}
                {hasProgress && (
                  <div className="flex items-center gap-2.5 bg-card rounded-xl px-5 py-3 border border-border shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Globe2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-display font-bold text-foreground leading-none">
                        {allProgress?.length ?? 0}
                      </p>
                      <p className="text-xs text-muted-foreground font-accent">
                        Languages
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-lingua-amber/15 text-lingua-ink px-4 py-2 rounded-full text-sm font-accent font-semibold mb-6 border border-lingua-amber/30">
                <Globe2 className="w-4 h-4" />
                10+ Languages to Explore
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-6xl text-foreground mb-4 tracking-tight">
                Learn Any Language,{" "}
                <span className="text-lingua-amber">Anytime</span>
              </h1>
              <p className="text-muted-foreground text-lg font-body mb-8 max-w-xl mx-auto">
                Flashcards, quizzes, and streaks — your passport to polyglot
                mastery. Join millions of learners worldwide.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Button
                  size="lg"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="gap-2 bg-primary hover:bg-primary/90 shadow-md font-accent font-semibold text-base px-8"
                  data-ocid="home.start_button"
                >
                  <Sparkles className="w-5 h-5" />
                  {isLoggingIn ? "Connecting…" : "Start Learning Free"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    document
                      .getElementById("language-grid")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="gap-2 font-accent font-semibold text-base"
                >
                  <BookOpen className="w-5 h-5" />
                  Browse Languages
                </Button>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground font-accent flex-wrap">
                <span>✨ Free to use</span>
                <span>🌍 14+ languages</span>
                <span>🎯 Spaced repetition</span>
                <span>🏆 Global leaderboard</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Language Grid */}
      <section className="py-12 px-4" id="language-grid">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                Choose a Language
              </h2>
              <p className="text-muted-foreground font-body mt-1">
                Click any language to begin your journey
              </p>
            </div>
            {languages && (
              <Badge
                variant="outline"
                className="font-accent font-semibold hidden sm:flex"
              >
                {languages.length} available
              </Badge>
            )}
          </div>

          {langLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <LanguageCardSkeleton key={i} />
              ))}
            </div>
          ) : !languages || languages.length === 0 ? (
            <div
              className="text-center py-16 bg-card rounded-2xl border border-border"
              data-ocid="home.empty_state"
            >
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                No Languages Yet
              </h3>
              <p className="text-muted-foreground font-body">
                Languages are being added. Check back soon!
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {languages.map((lang, i) => (
                <LanguageCard
                  key={lang.id}
                  language={lang}
                  progress={progressMap.get(lang.id)}
                  index={i + 1}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Features strip */}
      {!isAuthenticated && (
        <section className="py-14 px-4 bg-muted/40 border-t border-border">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  emoji: "🃏",
                  title: "Smart Flashcards",
                  desc: "Flip-card vocabulary practice with phonetic guides and example sentences.",
                },
                {
                  emoji: "🎯",
                  title: "Adaptive Quizzes",
                  desc: "Multiple-choice challenges that adapt to your level and track your score.",
                },
                {
                  emoji: "🔥",
                  title: "Daily Streaks",
                  desc: "Maintain your streak, earn badges, and climb the global leaderboard.",
                },
              ].map(({ emoji, title, desc }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-4">{emoji}</div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
