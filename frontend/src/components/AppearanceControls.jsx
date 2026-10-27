import { ThemePresetPicker } from "./ThemePresetPicker";
import { ThemeToggle } from "./ThemeToggle";
import { WallpaperPicker } from "./WallpaperPicker";

export function AppearanceControls({ compact = false, showPreset = true, className = "" }) {
  return (
    <div className={`flex shrink-0 items-center gap-0.5 sm:gap-1 ${className}`}>
      <WallpaperPicker />
      {showPreset ? <ThemePresetPicker /> : null}
      <ThemeToggle compact={compact} />
    </div>
  );
}
