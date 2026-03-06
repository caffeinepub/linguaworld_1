import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
  useParams,
  useRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import FlashcardPage from "./pages/FlashcardPage";
import HomePage from "./pages/HomePage";
import LanguageDetailPage from "./pages/LanguageDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";

// Re-export for use in components
export { Link, useNavigate, useParams, useRouter };

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

// Layout route
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

// Pages inside layout
const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: HomePage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});

const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profile",
  component: ProfilePage,
});

const languageRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/language/$languageId",
  component: LanguageDetailPage,
});

// Full-screen routes (no nav)
const flashcardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flashcards/$languageId/$categoryId",
  component: FlashcardPage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz/$languageId/$categoryId",
  component: QuizPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    leaderboardRoute,
    profileRoute,
    languageRoute,
  ]),
  flashcardRoute,
  quizRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
