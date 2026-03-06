import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe2,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Flashcard } from "../backend.d";
import { categoryIcons } from "../data/sampleData";
import {
  useCategories,
  useFlashcards,
  useLanguages,
  useRecordFlashcardViewed,
} from "../hooks/useQueries";

function FlashcardView({
  card,
  isFlipped,
  onFlip,
}: {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}) {
  return (
    <button
      type="button"
      className="card-flip-container w-full cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 rounded-3xl"
      style={{ height: "380px" }}
      onClick={onFlip}
      aria-label={isFlipped ? "Show front" : "Show translation"}
      data-ocid="flashcard.canvas_target"
    >
      <div className={`card-flip-inner ${isFlipped ? "flipped" : ""}`}>
        {/* Front: Target word */}
        <div className="card-face bg-card rounded-3xl border border-border shadow-xl flex flex-col items-center justify-center p-8 sm:p-12">
          <div className="text-xs font-accent font-semibold text-muted-foreground uppercase tracking-widest mb-6">
            Tap to reveal translation
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4 leading-tight">
              {card.targetWord}
            </p>
            {card.phonetic && (
              <div className="flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <p className="font-accent text-lg text-muted-foreground italic">
                  /{card.phonetic}/
                </p>
              </div>
            )}
          </div>
          <div className="mt-8 text-xs text-muted-foreground font-accent flex items-center gap-2">
            <RotateCcw className="w-3 h-3" />
            Click to flip
          </div>
        </div>

        {/* Back: Translation */}
        <div className="card-face card-back bg-primary rounded-3xl border border-primary/20 shadow-xl flex flex-col items-center justify-center p-8 sm:p-12">
          <div className="text-xs font-accent font-semibold text-primary-foreground/70 uppercase tracking-widest mb-6">
            Translation
          </div>
          <p className="font-display font-bold text-3xl sm:text-4xl text-primary-foreground mb-6 text-center">
            {card.translation}
          </p>
          {card.exampleSentence && (
            <div className="w-full max-w-sm bg-white/10 rounded-2xl p-4 border border-white/20 text-center">
              <p className="text-primary-foreground/90 font-body text-sm mb-2">
                &ldquo;{card.exampleSentence}&rdquo;
              </p>
              {card.exampleTranslation && (
                <p className="text-primary-foreground/60 font-accent text-xs italic">
                  {card.exampleTranslation}
                </p>
              )}
            </div>
          )}
          <div className="mt-6 text-xs text-primary-foreground/50 font-accent flex items-center gap-2">
            <RotateCcw className="w-3 h-3" />
            Click to go back
          </div>
        </div>
      </div>
    </button>
  );
}

export default function FlashcardPage() {
  const { languageId, categoryId } = useParams({
    from: "/flashcards/$languageId/$categoryId",
  });
  const navigate = useNavigate();

  const { data: languages } = useLanguages();
  const { data: categories } = useCategories(languageId);
  const { data: flashcards, isLoading } = useFlashcards(languageId, categoryId);
  const { mutate: recordViewed } = useRecordFlashcardViewed();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewedSet, setViewedSet] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);

  const language = languages?.find((l) => l.id === languageId);
  const category = categories?.find((c) => c.id === categoryId);
  const total = flashcards?.length ?? 0;
  const currentCard = flashcards?.[currentIndex];
  const progressPercent = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
  const categoryIcon = categoryIcons[category?.name ?? ""] ?? "📖";

  // Record view when card changes
  useEffect(() => {
    if (currentCard && !viewedSet.has(currentCard.id)) {
      setViewedSet((prev) => {
        const next = new Set(prev);
        next.add(currentCard.id);
        return next;
      });
      recordViewed({
        languageId,
        categoryId,
        flashcardId: currentCard.id,
      });
    }
  }, [currentCard, viewedSet, languageId, categoryId, recordViewed]);

  const handleFlip = useCallback(() => {
    setIsFlipped((v) => !v);
  }, []);

  const handleNext = useCallback(() => {
    if (!flashcards) return;
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, total, flashcards]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleDone = useCallback(() => {
    toast.success(`Great work! You reviewed all ${total} cards! 🎉`);
    navigate({ to: "/language/$languageId", params: { languageId } });
  }, [total, navigate, languageId]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") handleNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") handlePrev();
      if (e.key === " ") {
        e.preventDefault();
        handleFlip();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleNext, handlePrev, handleFlip]);

  return (
    <div
      className="min-h-screen bg-background flex flex-col page-enter"
      data-ocid="flashcard.page"
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
              {category?.name ?? "Flashcards"}
            </span>
          </div>

          {language && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-accent">
              <Globe2 className="w-4 h-4" />
              <span className="hidden sm:inline">{language.flag}</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 container mx-auto max-w-2xl px-4 py-8 flex flex-col">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="w-full h-96 rounded-3xl" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-10 w-28 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
        ) : !flashcards || total === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">📭</div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                No flashcards yet
              </h2>
              <p className="text-muted-foreground font-body mb-4">
                This category has no flashcards yet.
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
        ) : isComplete ? (
          /* Completion screen */
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-center max-w-sm"
            >
              <div className="text-7xl mb-6 animate-bounce-in">🎉</div>
              <h2 className="font-display font-bold text-3xl text-foreground mb-3">
                All Done!
              </h2>
              <p className="text-muted-foreground font-body mb-6">
                You reviewed all{" "}
                <strong className="text-foreground">{total}</strong> cards in{" "}
                <strong className="text-foreground">{category?.name}</strong>.
                Keep it up!
              </p>
              <Badge className="xp-glow bg-lingua-amber/20 text-lingua-ink border-lingua-amber/30 font-accent font-bold text-base px-5 py-2 mb-6">
                ⭐ +{total * 5} XP
              </Badge>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleDone}
                  className="gap-2 bg-primary hover:bg-primary/90 font-accent font-semibold"
                  data-ocid="flashcard.primary_button"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Done — Back to {language?.name}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRestart}
                  className="gap-2 font-accent"
                >
                  <RotateCcw className="w-4 h-4" />
                  Practice Again
                </Button>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-sm text-muted-foreground font-accent mb-2">
                <span>
                  Card{" "}
                  <strong className="text-foreground">
                    {currentIndex + 1}
                  </strong>{" "}
                  of <strong className="text-foreground">{total}</strong>
                </span>
                <span>{viewedSet.size} reviewed</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            {/* Flashcard */}
            <div className="flex-1 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="w-full"
                >
                  <FlashcardView
                    card={flashcards[currentIndex]}
                    isFlipped={isFlipped}
                    onFlip={handleFlip}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="gap-2 font-accent font-semibold"
                data-ocid="flashcard.secondary_button"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleFlip}
                className="gap-2 font-accent font-semibold"
                data-ocid="flashcard.toggle"
              >
                <RotateCcw className="w-5 h-5" />
                Flip
              </Button>

              <Button
                size="lg"
                onClick={handleNext}
                className="gap-2 bg-primary hover:bg-primary/90 font-accent font-semibold"
                data-ocid="flashcard.button"
              >
                {currentIndex < total - 1 ? (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Finish
                  </>
                )}
              </Button>
            </div>

            {/* Keyboard hint */}
            <p className="text-center text-xs text-muted-foreground font-accent mt-4">
              Use arrow keys to navigate · Space to flip
            </p>
          </>
        )}
      </div>
    </div>
  );
}
