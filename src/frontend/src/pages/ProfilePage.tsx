import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Check,
  Edit3,
  Flame,
  Globe2,
  LogIn,
  Star,
  Trophy,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { badgeInfo } from "../data/sampleData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllUserProgress,
  useLanguages,
  useProfile,
  useUpdateProfile,
} from "../hooks/useQueries";

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-card">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}
      >
        {icon}
      </div>
      <p className="font-display font-bold text-2xl text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground font-accent mt-0.5">
        {label}
      </p>
    </div>
  );
}

export default function ProfilePage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: profile, isLoading } = useProfile();
  const { data: allProgress, isLoading: progressLoading } =
    useAllUserProgress();
  const { data: languages } = useLanguages();
  const { mutateAsync: updateProfile, isPending: isSaving } =
    useUpdateProfile();

  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");

  const isAuthenticated = !!identity;

  const xp = profile ? Number(profile.xp) : 0;
  const streak = profile ? Number(profile.currentStreak) : 0;
  const badges = profile?.badges ?? [];

  const handleEditStart = () => {
    setUsernameInput(profile?.username ?? "");
    setEditingUsername(true);
  };

  const handleEditSave = async () => {
    const trimmed = usernameInput.trim();
    if (!trimmed || trimmed.length < 2) {
      toast.error("Username must be at least 2 characters");
      return;
    }
    try {
      await updateProfile(trimmed);
      toast.success("Username updated!");
      setEditingUsername(false);
    } catch {
      toast.error("Failed to update username");
    }
  };

  const handleEditCancel = () => {
    setEditingUsername(false);
    setUsernameInput("");
  };

  // Level calculation
  const level = Math.floor(xp / 500) + 1;
  const xpInCurrentLevel = xp % 500;
  const xpToNextLevel = 500;

  if (!isAuthenticated) {
    return (
      <div className="page-enter" data-ocid="profile.page">
        <div className="container mx-auto max-w-xl px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="font-display font-bold text-3xl text-foreground mb-3">
            Your Profile
          </h1>
          <p className="text-muted-foreground font-body mb-8">
            Sign in to track your progress, earn XP, and unlock badges.
          </p>
          <Button
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            className="gap-2 bg-primary hover:bg-primary/90 font-accent font-semibold"
          >
            <LogIn className="w-5 h-5" />
            {isLoggingIn ? "Connecting…" : "Sign In to View Profile"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" data-ocid="profile.page">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-1">
            Your Profile
          </h1>
          <p className="text-muted-foreground font-body">
            Track your learning journey and achievements
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-3xl border border-border shadow-card p-6 mb-6"
              data-ocid="profile.card"
            >
              <div className="flex flex-wrap items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                  <User className="w-8 h-8" />
                </div>

                {/* Username + Level */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {editingUsername ? (
                      <div className="flex items-center gap-2 w-full max-w-xs">
                        <Input
                          value={usernameInput}
                          onChange={(e) => setUsernameInput(e.target.value)}
                          className="font-display font-bold text-lg h-9"
                          maxLength={32}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") void handleEditSave();
                            if (e.key === "Escape") handleEditCancel();
                          }}
                          data-ocid="profile.input"
                        />
                        <Button
                          size="sm"
                          onClick={() => void handleEditSave()}
                          disabled={isSaving}
                          className="shrink-0 bg-primary hover:bg-primary/90 px-3"
                          data-ocid="profile.save_button"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditCancel}
                          className="shrink-0 px-3"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h2 className="font-display font-bold text-2xl text-foreground">
                          {profile?.username ?? "Unknown"}
                        </h2>
                        <button
                          type="button"
                          onClick={handleEditStart}
                          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          aria-label="Edit username"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="font-accent text-xs border-primary/30 text-primary bg-primary/5"
                    >
                      Level {level}
                    </Badge>
                    {streak > 0 && (
                      <Badge
                        variant="outline"
                        className="font-accent text-xs border-lingua-amber/30 text-lingua-ink bg-lingua-amber/10"
                      >
                        🔥 {streak} day streak
                      </Badge>
                    )}
                  </div>

                  {/* XP progress bar */}
                  <div className="mt-3 max-w-xs">
                    <div className="flex justify-between text-xs text-muted-foreground font-accent mb-1.5">
                      <span>Level {level}</span>
                      <span>
                        {xpInCurrentLevel}/{xpToNextLevel} XP
                      </span>
                    </div>
                    <Progress
                      value={(xpInCurrentLevel / xpToNextLevel) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground font-accent mt-1">
                      {xpToNextLevel - xpInCurrentLevel} XP to Level {level + 1}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatCard
                icon={<Star className="w-5 h-5 text-lingua-amber" />}
                label="Total XP"
                value={xp.toLocaleString()}
                color="bg-lingua-amber/15"
              />
              <StatCard
                icon={<Flame className="w-5 h-5 text-lingua-coral" />}
                label="Day Streak"
                value={streak}
                color="bg-lingua-coral/15"
              />
              <StatCard
                icon={<Globe2 className="w-5 h-5 text-primary" />}
                label="Languages"
                value={allProgress?.length ?? 0}
                color="bg-primary/10"
              />
              <StatCard
                icon={<Trophy className="w-5 h-5 text-lingua-sky" />}
                label="Level"
                value={level}
                color="bg-lingua-sky/15"
              />
            </div>

            {/* Badges */}
            <div className="bg-card rounded-2xl border border-border p-6 mb-6 shadow-card">
              <h3 className="font-display font-bold text-lg text-foreground mb-4">
                Badges
              </h3>
              {badges.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <div className="text-4xl mb-3">🏅</div>
                  <p className="font-body text-sm">
                    Complete lessons and quizzes to earn badges!
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {badges.map((badgeId) => {
                    const info = badgeInfo[badgeId] ?? {
                      icon: "🎖️",
                      label: badgeId,
                    };
                    return (
                      <div
                        key={badgeId}
                        className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 border border-border"
                      >
                        <span className="text-xl">{info.icon}</span>
                        <span className="text-sm font-accent font-medium text-foreground">
                          {info.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Language progress summary */}
            {!progressLoading && allProgress && allProgress.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">
                  Language Progress
                </h3>
                <div className="space-y-4">
                  {allProgress.map(([langId, prog]) => {
                    const lang = languages?.find((l) => l.id === langId);
                    const langXP = Number(prog.totalXP);
                    const lessons = prog.lessonsCompleted.length;
                    const progressPct = Math.min(100, (lessons / 30) * 100);
                    return (
                      <div key={langId} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {lang?.flag ?? "🌐"}
                            </span>
                            <span className="font-accent font-semibold text-sm text-foreground">
                              {lang?.name ?? langId}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground font-accent">
                            {langXP.toLocaleString()} XP · {lessons} words
                          </span>
                        </div>
                        <Progress value={progressPct} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
