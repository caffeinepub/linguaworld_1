import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Crown, LogIn, Star, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { getRankDisplay, sampleLeaderboard } from "../data/sampleData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLeaderboard, useProfile } from "../hooks/useQueries";

export default function LeaderboardPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: leaderboard, isLoading, isError } = useLeaderboard();
  const { data: profile } = useProfile();

  const isAuthenticated = !!identity;

  // Use backend data or fallback to sample
  const entries =
    leaderboard && leaderboard.length > 0 ? leaderboard : sampleLeaderboard;

  const currentUsername = profile?.username;

  return (
    <div className="page-enter" data-ocid="leaderboard.page">
      <div className="container mx-auto max-w-2xl px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lingua-amber/20 border border-lingua-amber/30 mb-4">
            <Trophy className="w-8 h-8 text-lingua-amber" />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-2">
            Leaderboard
          </h1>
          <p className="text-muted-foreground font-body">
            Top learners ranked by XP earned
          </p>
        </motion.div>

        {/* Podium (top 3) */}
        {!isLoading && entries.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-end justify-center gap-4 mb-8"
          >
            {/* 2nd place */}
            <div className="text-center flex-1 max-w-[120px]">
              <div className="text-3xl mb-2">🥈</div>
              <div className="bg-card rounded-t-2xl border border-border p-3 h-24 flex items-end justify-center pb-3">
                <div>
                  <p className="font-display font-bold text-sm text-foreground leading-tight">
                    {entries[1]?.username ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground font-accent">
                    {Number(entries[1]?.points ?? 0).toLocaleString()} XP
                  </p>
                </div>
              </div>
            </div>

            {/* 1st place */}
            <div className="text-center flex-1 max-w-[140px]">
              <Crown className="w-7 h-7 text-lingua-amber mx-auto mb-2" />
              <div className="bg-primary/5 rounded-t-2xl border border-primary/20 p-3 h-32 flex items-end justify-center pb-3">
                <div>
                  <p className="font-display font-bold text-sm text-foreground leading-tight">
                    {entries[0]?.username ?? "—"}
                  </p>
                  <p className="text-xs text-primary font-accent font-semibold">
                    {Number(entries[0]?.points ?? 0).toLocaleString()} XP
                  </p>
                </div>
              </div>
            </div>

            {/* 3rd place */}
            <div className="text-center flex-1 max-w-[120px]">
              <div className="text-3xl mb-2">🥉</div>
              <div className="bg-card rounded-t-2xl border border-border p-3 h-20 flex items-end justify-center pb-3">
                <div>
                  <p className="font-display font-bold text-sm text-foreground leading-tight">
                    {entries[2]?.username ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground font-accent">
                    {Number(entries[2]?.points ?? 0).toLocaleString()} XP
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
        >
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <Skeleton className="flex-1 h-5" />
                  <Skeleton className="w-20 h-5" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="font-body text-muted-foreground">
                Failed to load leaderboard. Showing sample data.
              </p>
            </div>
          ) : (
            <Table data-ocid="leaderboard.table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-accent font-semibold text-xs text-muted-foreground uppercase tracking-wider w-16">
                    Rank
                  </TableHead>
                  <TableHead className="font-accent font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    Player
                  </TableHead>
                  <TableHead className="font-accent font-semibold text-xs text-muted-foreground uppercase tracking-wider text-right">
                    XP
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.slice(0, 10).map((entry, idx) => {
                  const rank = idx + 1;
                  const isCurrentUser =
                    currentUsername && entry.username === currentUsername;
                  return (
                    <TableRow
                      // biome-ignore lint/suspicious/noArrayIndexKey: leaderboard rank position is deterministic
                      key={idx}
                      data-ocid={`leaderboard.row.${rank}`}
                      className={`border-border transition-colors ${
                        isCurrentUser
                          ? "bg-primary/5 hover:bg-primary/8"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <TableCell className="font-display font-bold text-lg">
                        {rank <= 3 ? (
                          <span className="text-xl">
                            {getRankDisplay(rank)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-base font-accent">
                            #{rank}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-display font-bold shrink-0 ${
                              isCurrentUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <span
                            className={`font-accent font-semibold text-sm ${
                              isCurrentUser ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {entry.username}
                          </span>
                          {isCurrentUser && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0.5 border-primary/30 text-primary font-accent"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Star className="w-3.5 h-3.5 text-lingua-amber shrink-0" />
                          <span className="font-display font-bold text-foreground">
                            {Number(entry.points).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </motion.div>

        {/* CTA if not logged in */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center bg-primary/5 rounded-2xl border border-primary/15 p-6"
          >
            <Trophy className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-foreground mb-2">
              Compete on the Leaderboard
            </h3>
            <p className="text-sm text-muted-foreground font-body mb-4">
              Sign in to earn XP, track your rank, and beat the competition.
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="gap-2 bg-primary hover:bg-primary/90 font-accent font-semibold"
            >
              <LogIn className="w-4 h-4" />
              {isLoggingIn ? "Connecting…" : "Sign In to Compete"}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
