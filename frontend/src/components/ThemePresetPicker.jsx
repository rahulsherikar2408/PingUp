import { Button, Modal, useOverlayState } from "@heroui/react";
import { Check, Palette } from "lucide-react";
import { applyThemePresetToDocument, useTheme } from "../context/theme";
import { HERO_UI_THEME_PRESETS } from "../data/herouiThemePresets";

export function ThemePresetPicker() {
  const modal = useOverlayState();
  const { themePreset, setThemePreset } = useTheme();

  const handleSelect = (id) => {
    applyThemePresetToDocument(id);
    setThemePreset(id);
    modal.close();
  };

  return (
    <Modal.Root state={modal}>
      <Modal.Trigger>
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          className="size-8 sm:size-8.5 shrink-0 text-foreground transition-transform active:scale-95"
          aria-label="Change accent color preset"
          title="Accent theme"
        >
          <Palette className="size-4.5 sm:size-5" />
        </Button>
      </Modal.Trigger>

      <Modal.Backdrop variant="opaque">
        <Modal.Container size="md" scroll="inside" placement="center">
          <Modal.Dialog className="max-h-[85dvh] w-full max-w-lg border border-border bg-surface text-foreground shadow-2xl dark:border-white/10 dark:bg-[#1e1e22]">
            <Modal.Header className="flex flex-row items-center justify-between gap-3 border-b border-border pb-3 dark:border-white/10">
              <Modal.Heading className="text-lg font-semibold tracking-tight text-foreground dark:text-white">
                Accent theme
              </Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="isolate pt-4 pb-6">
              <p className="mb-4 text-xs sm:text-sm text-muted dark:text-zinc-400">
                Components use the accent color for active indicators, primary buttons, and focus.
              </p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {HERO_UI_THEME_PRESETS.map((p) => {
                  const selected = themePreset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelect(p.id)}
                      className={[
                        "relative flex flex-col items-center gap-2 rounded-xl p-2.5 text-center transition-all cursor-pointer",
                        selected
                          ? "bg-accent-soft/40 ring-2 ring-accent ring-offset-2 ring-offset-surface dark:ring-offset-[#1e1e22]"
                          : "hover:bg-foreground/5",
                      ].join(" ")}
                      aria-pressed={selected}
                    >
                      <span className="relative">
                        <span
                          className="block size-12 sm:size-14 shrink-0 rounded-full shadow-md ring-1 ring-black/10 dark:ring-white/20 transition-transform hover:scale-105"
                          style={{ background: p.swatch }}
                        />

                        {selected ? (
                          <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md">
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={[
                          "text-[11px] font-medium leading-tight",
                          selected ? "font-semibold text-accent" : "text-muted dark:text-zinc-400",
                        ].join(" ")}
                      >
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}
