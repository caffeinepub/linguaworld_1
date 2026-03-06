import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Category,
  Flashcard,
  Highscore,
  Language,
  LanguageProgress,
  QuizQuestion,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Languages ─────────────────────────────────────────────────────────────
export function useLanguages() {
  const { actor, isFetching } = useActor();
  return useQuery<Language[]>({
    queryKey: ["languages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLanguages();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Categories ────────────────────────────────────────────────────────────
export function useCategories(languageId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories", languageId],
    queryFn: async () => {
      if (!actor || !languageId) return [];
      return actor.getCategories(languageId);
    },
    enabled: !!actor && !isFetching && !!languageId,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Flashcards ─────────────────────────────────────────────────────────────
export function useFlashcards(languageId: string, categoryId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Flashcard[]>({
    queryKey: ["flashcards", languageId, categoryId],
    queryFn: async () => {
      if (!actor || !languageId || !categoryId) return [];
      return actor.getFlashcards(languageId, categoryId);
    },
    enabled: !!actor && !isFetching && !!languageId && !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Quiz Questions ─────────────────────────────────────────────────────────
export function useQuizQuestions(languageId: string, categoryId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<QuizQuestion[]>({
    queryKey: ["quiz", languageId, categoryId],
    queryFn: async () => {
      if (!actor || !languageId || !categoryId) return [];
      return actor.getQuizQuestions(languageId, categoryId);
    },
    enabled: !!actor && !isFetching && !!languageId && !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Profile ────────────────────────────────────────────────────────────────
export function useProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProfile();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}

// ─── Create/Get Profile ─────────────────────────────────────────────────────
export function useGetOrCreateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (username: string) => {
      if (!actor) throw new Error("Actor not ready");
      const profile = await actor.getOrCreateProfile(username);
      await actor.updateStreak();
      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

// ─── Update Profile ─────────────────────────────────────────────────────────
export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (username: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateProfile(username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

// ─── Record Flashcard Viewed ─────────────────────────────────────────────────
export function useRecordFlashcardViewed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      languageId,
      categoryId,
      flashcardId,
    }: {
      languageId: string;
      categoryId: string;
      flashcardId: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.recordFlashcardViewed(languageId, categoryId, flashcardId);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["progress", vars.languageId],
      });
      queryClient.invalidateQueries({ queryKey: ["allProgress"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// ─── Record Quiz Score ───────────────────────────────────────────────────────
export function useRecordQuizScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      languageId,
      categoryId,
      score,
      total,
    }: {
      languageId: string;
      categoryId: string;
      score: number;
      total: number;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.recordQuizScore(
        languageId,
        categoryId,
        BigInt(score),
        BigInt(total),
      );
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["progress", vars.languageId],
      });
      queryClient.invalidateQueries({ queryKey: ["allProgress"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

// ─── User Progress ───────────────────────────────────────────────────────────
export function useUserProgress(languageId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<LanguageProgress | null>({
    queryKey: ["progress", languageId],
    queryFn: async () => {
      if (!actor || !languageId) return null;
      return actor.getUserProgress(languageId);
    },
    enabled: !!actor && !isFetching && !!languageId,
    staleTime: 1000 * 60 * 1,
  });
}

// ─── All User Progress ───────────────────────────────────────────────────────
export function useAllUserProgress() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, LanguageProgress]>>({
    queryKey: ["allProgress"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserProgress();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 1,
  });
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export function useLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery<Highscore[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}

// ─── Update Streak ───────────────────────────────────────────────────────────
export function useUpdateStreak() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateStreak();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
