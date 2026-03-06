import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Outlet } from "@tanstack/react-router";
import { Link, useRouterState } from "@tanstack/react-router";
import { Globe2, LogIn, LogOut, Menu, Trophy, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useProfile } from "../hooks/useQueries";
import UsernameModal from "./UsernameModal";

export default function Layout() {
  const { identity, login, clear, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const { data: profile } = useProfile();
  const routerState = useRouterState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const isAuthenticated = !!identity;
  const currentPath = routerState.location.pathname;

  // Show username modal after login if no profile
  useEffect(() => {
    if (isAuthenticated && profile === null) {
      setShowUsernameModal(true);
    }
  }, [isAuthenticated, profile]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/profile", label: "Profile" },
  ];

  const isActive = (to: string) => {
    if (to === "/") return currentPath === "/";
    return currentPath.startsWith(to);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            data-ocid="nav.link"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-glow-green transition-shadow">
              <Globe2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">
              Lingua<span className="text-lingua-amber">World</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(to)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-ocid={`nav.${label.toLowerCase()}.link`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth + Streak */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && profile && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-accent">
                  {Number(profile.xp).toLocaleString()} XP
                </span>
                {Number(profile.currentStreak) > 0 && (
                  <Badge
                    variant="secondary"
                    className="streak-pulse bg-lingua-amber/20 text-lingua-ink border-lingua-amber/30 font-accent font-semibold"
                  >
                    🔥 {Number(profile.currentStreak)}
                  </Badge>
                )}
              </div>
            )}
            {isInitializing ? (
              <div className="w-20 h-9 rounded-lg bg-muted animate-pulse" />
            ) : isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="gap-2 text-muted-foreground"
                data-ocid="nav.logout.button"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="gap-2 bg-primary hover:bg-primary/90"
                data-ocid="nav.login.button"
              >
                <LogIn className="w-4 h-4" />
                {isLoggingIn ? "Connecting…" : "Sign In"}
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 pb-4">
            <nav className="flex flex-col gap-1 pt-3">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(to)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-border mt-3">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clear();
                    setMobileOpen(false);
                  }}
                  className="w-full gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    login();
                    setMobileOpen(false);
                  }}
                  disabled={isLoggingIn}
                  className="w-full gap-2 bg-primary"
                >
                  <LogIn className="w-4 h-4" />
                  {isLoggingIn ? "Connecting…" : "Sign In"}
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-6 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4" />
            <span className="font-display font-semibold text-foreground">
              LinguaWorld
            </span>
            <span>— Learn any language, anywhere.</span>
          </div>
          <span>
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </span>
        </div>
      </footer>

      {/* Username Setup Modal */}
      <UsernameModal
        open={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
      />
    </div>
  );
}
