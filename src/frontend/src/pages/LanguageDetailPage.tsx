import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Lock,
} from "lucide-react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import type { Category } from "../backend.d";
import { categoryIcons } from "../data/sampleData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCategories,
  useLanguages,
  useUserProgress,
} from "../hooks/useQueries";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0 },
};

function CategoryCard({
  category,
  index,
  languageId,
  isCompleted,
}: {
  category: Category;
  index: number;
  languageId: string;
  isCompleted: boolean;
}) {
  const navigate = useNavigate();
  const icon = categoryIcons[category.name] ?? "📖";

  return (
    <motion.div variants={itemVariants}>
      <div
        className="bg-card rounded-2xl border border-border p-5 shadow-card flex flex-col sm:flex-row sm:items-center gap-4"
        data-ocid={`category.item.${index}`}
      >
        {/* Left: Icon + Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center shrink-0 border border-primary/10">
            <span className="text-3xl" role="img" aria-label={category.name}>
              {icon}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="font-display font-bold text-base text-foreground">
                {category.name}
              </h3>
              {isCompleted && (
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground font-accent">
              Tap to practice
            </p>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex gap-2 sm:shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                to: "/flashcards/$languageId/$categoryId",
                params: { languageId, categoryId: category.id },
              })
            }
            className="gap-2 font-accent font-semibold flex-1 sm:flex-initial"
            data-ocid={`category.flashcard_button.${index}`}
          >
            <BookOpen className="w-4 h-4" />
            Practice
          </Button>
          <Button
            size="sm"
            onClick={() =>
              navigate({
                to: "/quiz/$languageId/$categoryId",
                params: { languageId, categoryId: category.id },
              })
            }
            className="gap-2 bg-primary hover:bg-primary/90 font-accent font-semibold flex-1 sm:flex-initial"
            data-ocid={`category.quiz_button.${index}`}
          >
            <HelpCircle className="w-4 h-4" />
            Quiz
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function CategoryCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
      <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export default function LanguageDetailPage() {
  const { languageId } = useParams({ from: "/layout/language/$languageId" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const { data: languages, isLoading: langLoading } = useLanguages();
  const { data: categories, isLoading: catLoading } = useCategories(languageId);
  const { data: progress } = useUserProgress(languageId);

  const language = languages?.find((l) => l.id === languageId);
  const isLoading = langLoading || catLoading;

  const completedCategoryIds = new Set(progress?.lessonsCompleted ?? []);

  const xp = progress ? Number(progress.totalXP) : 0;
  const quizScores = progress?.quizScores ?? [];
  const avgScore =
    quizScores.length > 0
      ? Math.round(
          quizScores.reduce((a, b) => a + Number(b), 0) / quizScores.length,
        )
      : 0;

  const categoriesCompleted = categories
    ? categories.filter((c) => completedCategoryIds.has(c.id)).length
    : 0;

  const totalCategories = categories?.length ?? 0;
  const overallProgress =
    totalCategories > 0
      ? Math.round((categoriesCompleted / totalCategories) * 100)
      : 0;

  return (
    <div className="page-enter" data-ocid="language.page">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/" })}
          className="gap-2 text-muted-foreground hover:text-foreground mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Language Header */}
        {isLoading ? (
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ) : language ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-4xl border border-border">
                  {language.flag}
                </div>
                <div>
                  <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
                    {language.name}
                  </h1>
                  <p className="text-muted-foreground font-accent text-sm mt-1">
                    {totalCategories} categories to explore
                  </p>
                </div>
              </div>

              {/* XP badge */}
              {xp > 0 && (
                <Badge className="bg-primary/10 text-primary border-primary/20 font-accent font-semibold text-sm px-4 py-1.5">
                  ⭐ {xp.toLocaleString()} XP
                </Badge>
              )}
            </div>

            {/* Progress summary */}
            {identity && (
              <div className="mt-6 bg-muted/50 rounded-xl p-4 border border-border">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="font-display font-bold text-2xl text-foreground">
                        {categoriesCompleted}
                        <span className="text-muted-foreground text-lg">
                          /{totalCategories}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground font-accent">
                        Completed
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-display font-bold text-2xl text-foreground">
                        {xp.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground font-accent">
                        XP Earned
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-display font-bold text-2xl text-foreground">
                        {quizScores.length > 0 ? `${avgScore}%` : "—"}
                      </p>
                      <p className="text-xs text-muted-foreground font-accent">
                        Avg Quiz
                      </p>
                    </div>
                  </div>
                  {overallProgress > 0 && (
                    <div className="flex-1 min-w-[140px]">
                      <div className="flex justify-between text-xs text-muted-foreground font-accent mb-1.5">
                        <span>Overall Progress</span>
                        <span>{overallProgress}%</span>
                      </div>
                      <Progress value={overallProgress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl text-foreground mb-2">
              Language Not Found
            </h2>
            <p className="text-muted-foreground font-body">
              This language doesn&apos;t exist or isn&apos;t available yet.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate({ to: "/" })}
            >
              Back to Home
            </Button>
          </div>
        )}

        {/* Categories List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <>
            <h2 className="font-display font-bold text-xl text-foreground mb-4">
              Categories
            </h2>
            <motion.div
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {categories.map((cat, i) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  index={i + 1}
                  languageId={languageId}
                  isCompleted={completedCategoryIds.has(cat.id)}
                />
              ))}
            </motion.div>
          </>
        ) : language ? (
          <div
            className="text-center py-16 bg-card rounded-2xl border border-border"
            data-ocid="category.empty_state"
          >
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              No Categories Yet
            </h3>
            <p className="text-muted-foreground font-body">
              Content for {language.name} is coming soon!
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
