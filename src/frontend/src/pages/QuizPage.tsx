import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { QuizQuestion } from "../backend.d";
import { categoryIcons } from "../data/sampleData";
import {
  useCategories,
  useLanguages,
  useQuizQuestions,
  useRecordQuizScore,
} from "../hooks/useQueries";

type AnswerState = "idle" | "correct" | "wrong";

function QuestionCard({
  question,
  questionNumber,
  total,
  onAnswer,
}: {
  question: QuizQuestion;
  questionNumber: number;
  total: number;
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const correctIndex = Number(question.correctIndex);

  const handleSelect = (idx: number) => {
    if (answerState !== "idle") return;
    setSelectedIndex(idx);
    const isCorrect = idx === correctIndex;
    setAnswerState(isCorrect ? "correct" : "wrong");

    // Auto-advance after a short delay
    setTimeout(() => {
      onAnswer(idx, isCorrect);
    }, 1200);
  };

  const getOptionClass = (idx: number) => {
    const base =
      "w-full text-left px-5 py-4 rounded-xl border-2 font-accent font-medium text-sm transition-all duration-200 ";

    if (answerState === "idle") {
      return `${base}border-border bg-card hover:border-primary/40 hover:bg-primary/5 cursor-pointer active:scale-[0.98]`;
    }
    if (idx === correctIndex) {
      return `${base}quiz-answer-correct cursor-default border-2`;
    }
    if (idx === selectedIndex && answerState === "wrong") {
      return `${base}quiz-answer-wrong cursor-default border-2`;
    }
    return `${base}border-border bg-card opacity-50 cursor-default`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full"
    >
      {/* Question */}
      <div className="bg-primary/5 rounded-2xl p-6 mb-6 border border-primary/10">
        <p className="text-xs font-accent font-semibold text-primary/70 uppercase tracking-widest mb-3">
          Question {questionNumber} of {total}
        </p>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground leading-tight">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: option order is deterministic
            key={idx}
            type="button"
            className={getOptionClass(idx)}
            onClick={() => handleSelect(idx)}
            disabled={answerState !== "idle"}
            data-ocid={`quiz.item.${idx + 1}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold font-accent text-muted-foreground shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </div>
              {answerState !== "idle" && idx === correctIndex && (
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              )}
              {answerState !== "idle" &&
                idx === selectedIndex &&
                answerState === "wrong" && (
                  <XCircle className="w-5 h-5 text-lingua-coral shrink-0" />
                )}
            </div>
          </button>
        ))}
      </div>

      {/* Feedback banner */}
      <AnimatePresence>
        {answerState !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 p-3 rounded-xl flex items-center gap-3 text-sm font-accent font-semibold ${
              answerState === "correct"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-lingua-coral/10 text-lingua-coral border border-lingua-coral/20"
            }`}
          >
            {answerState === "correct" ? (
              <>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Correct! +10 XP
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 shrink-0" />
                The correct answer was: {question.options[correctIndex]}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ResultsScreen({
  score,
  total,
  onTryAgain,
  onBack,
  languageName,
  categoryName,
}: {
  score: number;
  total: number;
  onTryAgain: () => void;
  onBack: () => void;
  languageName?: string;
  categoryName?: string;
}) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const xpEarned = score * 15;

  let emoji = "😅";
  let message = "Keep practicing!";
  if (percentage >= 90) {
    emoji = "🏆";
    message = "Outstanding!";
  } else if (percentage >= 70) {
    emoji = "🎉";
    message = "Great work!";
  } else if (percentage >= 50) {
    emoji = "👍";
    message = "Good effort!";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="flex-1 flex items-center justify-center"
      data-ocid="quiz.panel"
    >
      <div className="text-center max-w-sm w-full">
        {/* Score ring */}
        <div className="relative inline-flex items-center justify-center w-36 h-36 mb-6">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="oklch(0.88 0.02 85)"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="oklch(0.35 0.12 152)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 42 * (1 - percentage / 100),
              }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="font-display font-bold text-3xl text-foreground">
              {percentage}%
            </span>
            <span className="text-xs text-muted-foreground font-accent">
              score
            </span>
          </div>
        </div>

        <div className="text-5xl mb-4 animate-bounce-in">{emoji}</div>
        <h2 className="font-display font-bold text-3xl text-foreground mb-2">
          {message}
        </h2>
        <p className="text-muted-foreground font-body mb-2">
          You answered{" "}
          <strong className="text-foreground">
            {score}/{total}
          </strong>{" "}
          correctly{categoryName && ` in ${categoryName}`}.
        </p>

        {/* XP gained */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="inline-flex items-center gap-2 bg-lingua-amber/20 text-lingua-ink border border-lingua-amber/30 rounded-full px-5 py-2 font-accent font-bold text-base mb-8 xp-glow"
        >
          <Zap className="w-4 h-4 text-lingua-amber" />+{xpEarned} XP Earned
        </motion.div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onBack}
            className="gap-2 bg-primary hover:bg-primary/90 font-accent font-semibold"
            data-ocid="quiz.primary_button"
          >
            <Trophy className="w-4 h-4" />
            Back to {languageName ?? "Language"}
          </Button>
          <Button
            variant="outline"
            onClick={onTryAgain}
            className="gap-2 font-accent"
            data-ocid="quiz.secondary_button"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function QuizPage() {
  const { languageId, categoryId } = useParams({
    from: "/quiz/$languageId/$categoryId",
  });
  const navigate = useNavigate();

  const { data: languages } = useLanguages();
  const { data: categories } = useCategories(languageId);
  const { data: questions, isLoading } = useQuizQuestions(
    languageId,
    categoryId,
  );
  const { mutate: recordScore } = useRecordQuizScore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [key, setKey] = useState(0);

  const language = languages?.find((l) => l.id === languageId);
  const category = categories?.find((c) => c.id === categoryId);
  const categoryIcon = categoryIcons[category?.name ?? ""] ?? "📖";
  const total = questions?.length ?? 0;
  const progressPercent =
    total > 0 ? ((currentQuestionIndex + 1) / total) * 100 : 0;

  const handleAnswer = useCallback(
    (_selectedIndex: number, isCorrect: boolean) => {
      const newScore = isCorrect ? score + 1 : score;
      if (isCorrect) setScore((s) => s + 1);

      if (currentQuestionIndex < total - 1) {
        setCurrentQuestionIndex((i) => i + 1);
      } else {
        setIsFinished(true);
        recordScore({
          languageId,
          categoryId,
          score: newScore,
          total,
        });
        toast.success(`Quiz complete! +${newScore * 15} XP earned 🎯`, {
          duration: 3000,
        });
      }
    },
    [currentQuestionIndex, total, score, languageId, categoryId, recordScore],
  );

  const handleTryAgain = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsFinished(false);
    setKey((k) => k + 1);
  }, []);

  const handleBack = useCallback(() => {
    navigate({
      to: "/language/$languageId",
      params: { languageId },
    });
  }, [navigate, languageId]);

  return (
    <div
      className="min-h-screen bg-background flex flex-col page-enter"
      data-ocid="quiz.page"
    >
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="container mx-auto max-w-2xl flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate({
                to: "/language/$languageId",
                params: { languageId },
              })
            }
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{language?.name}</span>
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xl">{categoryIcon}</span>
            <span className="font-display font-bold text-base text-foreground">
              {category?.name ?? "Quiz"}
            </span>
          </div>

          {!isFinished && total > 0 && (
            <Badge
              variant="outline"
              className="font-accent font-semibold text-xs"
            >
              {score}/{currentQuestionIndex} correct
            </Badge>
          )}
        </div>
      </header>

      <div className="flex-1 container mx-auto max-w-2xl px-4 py-8 flex flex-col">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-36 w-full rounded-2xl" />
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : !questions || total === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">📭</div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                No quiz questions yet
              </h2>
              <p className="text-muted-foreground font-body mb-4">
                Try the flashcards first to practice vocabulary.
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  navigate({
                    to: "/language/$languageId",
                    params: { languageId },
                  })
                }
              >
                Go Back
              </Button>
            </div>
          </div>
        ) : isFinished ? (
          <ResultsScreen
            score={score}
            total={total}
            onTryAgain={handleTryAgain}
            onBack={handleBack}
            languageName={language?.name}
            categoryName={category?.name}
          />
        ) : (
          <>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-sm text-muted-foreground font-accent mb-2">
                <span>
                  Question{" "}
                  <strong className="text-foreground">
                    {currentQuestionIndex + 1}
                  </strong>{" "}
                  of <strong className="text-foreground">{total}</strong>
                </span>
                <span className="text-primary font-semibold">
                  {score} correct
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            {/* Question */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <QuestionCard
                  key={`${key}-${currentQuestionIndex}`}
                  question={questions[currentQuestionIndex]}
                  questionNumber={currentQuestionIndex + 1}
                  total={total}
                  onAnswer={handleAnswer}
                />
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
