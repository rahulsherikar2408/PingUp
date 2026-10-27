import { Button, Modal, useOverlayState } from "@heroui/react";
import { Check, ImageIcon } from "lucide-react";
import { useTransition } from "react";
import { useWallpaper } from "../context/wallpaper";
import { WALLPAPER_SECTIONS, WALLPAPERS } from "../data/wallpapers";

function WallpaperThumb({ wallpaper, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(wallpaper.id)}
      className={[
        "group relative aspect-4/3 w-full overflow-hidden rounded-xl bg-zinc-900 contain-[layout] cursor-pointer transition-transform active:scale-95",
        selected
          ? "outline-2 outline-offset-2 outline-accent"
          : "outline-1 outline-transparent hover:outline-accent/50",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
      ].join(" ")}
      aria-pressed={selected}
    >
      <img
        src={wallpaper.url}
        alt={wallpaper.label}
        width={320}
        height={240}
        className="pointer-events-none h-full w-full object-cover select-none transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
        referrerPolicy="no-referrer"
        draggable={false}
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/80 via-black/40 to-transparent px-2 py-1.5 text-left text-[11px] font-medium leading-tight text-white/95">
        {wallpaper.label}
      </span>
      {selected ? (
        <span className="absolute right-1.5 top-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      ) : null}
    </button>
  );
}

export function WallpaperPicker() {
  const modal = useOverlayState();
  const { wallpaperId, setWallpaperId } = useWallpaper();
  const [, startTransition] = useTransition();

  const handleSelect = (id) => {
    modal.close();
    startTransition(() => {
      setWallpaperId(id);
    });
  };

  return (
    <Modal.Root state={modal}>
      <Modal.Trigger>
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          className="size-8 sm:size-8.5 shrink-0 text-foreground transition-transform active:scale-95"
          aria-label="Change wallpaper backdrop"
          title="Change backdrop"
        >
          <ImageIcon className="size-4.5 sm:size-5" />
        </Button>
      </Modal.Trigger>

      <Modal.Backdrop variant="opaque">
        <Modal.Container size="lg" scroll="inside" placement="center">
          <Modal.Dialog className="max-h-[85dvh] w-full max-w-2xl border border-border bg-surface text-foreground shadow-2xl dark:border-white/10 dark:bg-[#1e1e22]">
            <Modal.Header className="flex flex-row items-center justify-between gap-3 border-b border-border pb-3 dark:border-white/10">
              <Modal.Heading className="text-lg font-semibold tracking-tight text-foreground dark:text-white">
                Backdrop
              </Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="isolate space-y-6 pt-4 pb-6">
              {WALLPAPER_SECTIONS.map((section) => (
                <section key={section.id} className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted dark:text-zinc-400">
                    {section.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                    {WALLPAPERS.filter((w) => w.category === section.id).map((w) => (
                      <WallpaperThumb
                        key={w.id}
                        wallpaper={w}
                        selected={wallpaperId === w.id}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}
