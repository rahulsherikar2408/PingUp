import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/theme";

export function ThemeToggle({ compact = false, className = "" }) {
  const { theme, setTheme, toggleTheme } = useTheme();

  if (compact) {
    return (
      <Button
        size="sm"
        variant="ghost"
        isIconOnly
        className={`size-8 sm:size-8.5 shrink-0 text-foreground transition-transform active:scale-95 ${className}`}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        onPress={toggleTheme}
      >
        {theme === "dark" ? (
          <Sun className="size-4.5 sm:size-5 text-amber-400" />
        ) : (
          <Moon className="size-4.5 sm:size-5 text-indigo-500" />
        )}
      </Button>
    );
  }

  return (
    <div className={`flex shrink-0 items-center ${className}`}>
      {/* Mobile single toggle */}
      <Button
        size="sm"
        variant="ghost"
        isIconOnly
        className="size-8 sm:hidden shrink-0 text-foreground transition-transform active:scale-95"
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        onPress={toggleTheme}
      >
        {theme === "dark" ? (
          <Sun className="size-4.5 text-amber-400" />
        ) : (
          <Moon className="size-4.5 text-indigo-500" />
        )}
      </Button>

      {/* Desktop segmented pill */}
      <div className="hidden sm:flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5 shadow-xs">
        <Button
          size="sm"
          variant={theme === "light" ? "primary" : "ghost"}
          isIconOnly
          className="size-7"
          aria-label="Light mode"
          title="Light mode"
          onPress={() => setTheme("light")}
        >
          <Sun className="size-3.5" />
        </Button>
        <Button
          size="sm"
          variant={theme === "dark" ? "primary" : "ghost"}
          isIconOnly
          className="size-7"
          aria-label="Dark mode"
          title="Dark mode"
          onPress={() => setTheme("dark")}
        >
          <Moon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
