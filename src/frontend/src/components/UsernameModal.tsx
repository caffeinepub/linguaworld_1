import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetOrCreateProfile } from "../hooks/useQueries";

interface UsernameModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UsernameModal({ open, onClose }: UsernameModalProps) {
  const [username, setUsername] = useState("");
  const { mutateAsync, isPending } = useGetOrCreateProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 2) {
      toast.error("Username must be at least 2 characters");
      return;
    }
    try {
      await mutateAsync(trimmed);
      toast.success("Welcome to LinguaWorld! 🌍");
      onClose();
    } catch {
      toast.error("Failed to create profile. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-md"
        data-ocid="username.dialog"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl">
                Welcome to LinguaWorld!
              </DialogTitle>
              <DialogDescription className="text-sm">
                Choose a display name to get started.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="username-input"
              className="font-accent font-semibold text-sm"
            >
              Your Username
            </Label>
            <Input
              id="username-input"
              placeholder="e.g. PolyglotPete"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={32}
              autoFocus
              className="font-body"
              data-ocid="profile.input"
            />
            <p className="text-xs text-muted-foreground">
              This is how you'll appear on the leaderboard.
            </p>
          </div>
          <Button
            type="submit"
            className="w-full gap-2 bg-primary hover:bg-primary/90"
            disabled={isPending || username.trim().length < 2}
            data-ocid="profile.save_button"
          >
            <Sparkles className="w-4 h-4" />
            {isPending ? "Setting up…" : "Start Learning"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
