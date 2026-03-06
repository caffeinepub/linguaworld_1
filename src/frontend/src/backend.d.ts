import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Category {
    id: string;
    languageId: string;
    name: string;
}
export interface Flashcard {
    id: string;
    categoryId: string;
    exampleSentence: string;
    languageId: string;
    exampleTranslation: string;
    translation: string;
    targetWord: string;
    phonetic: string;
}
export interface LanguageProgress {
    quizScores: Array<bigint>;
    languageId: string;
    totalXP: bigint;
    lessonsCompleted: Array<string>;
}
export interface Language {
    id: string;
    code: string;
    flag: string;
    name: string;
}
export interface QuizQuestion {
    id: string;
    categoryId: string;
    question: string;
    correctIndex: bigint;
    languageId: string;
    flashcardId: string;
    options: Array<string>;
}
export interface Highscore {
    username: string;
    points: bigint;
}
export interface UserProfile {
    xp: bigint;
    username: string;
    badges: Array<string>;
    lastActiveDate: bigint;
    currentStreak: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllUserProgress(): Promise<Array<[string, LanguageProgress]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(languageId: string): Promise<Array<Category>>;
    getFlashcards(languageId: string, categoryId: string): Promise<Array<Flashcard>>;
    getLanguages(): Promise<Array<Language>>;
    getLeaderboard(): Promise<Array<Highscore>>;
    getOrCreateProfile(username: string): Promise<UserProfile>;
    getProfile(): Promise<UserProfile | null>;
    getQuizQuestions(languageId: string, categoryId: string): Promise<Array<QuizQuestion>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProgress(languageId: string): Promise<LanguageProgress | null>;
    isCallerAdmin(): Promise<boolean>;
    recordFlashcardViewed(languageId: string, categoryId: string, flashcardId: string): Promise<void>;
    recordQuizScore(languageId: string, categoryId: string, score: bigint, total: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProfile(username: string): Promise<void>;
    updateStreak(): Promise<void>;
}
