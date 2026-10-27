import { APP_NAME } from "../AppLogo";
import { AuthHeroPattern } from "./AuthHeroPattern";

const heroPanelClassName = [
  "relative flex shrink-0 flex-col overflow-hidden",
  "bg-surface dark:bg-black/50",
  "border-b border-border md:border-b-0 md:border-r",
  "md:w-[44%] md:max-w-xl",
  "lg:w-[42%] lg:max-w-none",
].join(" ");

const heroImageClassName = [
  "h-auto max-h-36 sm:max-h-48 md:max-h-[min(50vh,420px)] w-auto max-w-[min(85%,18rem)] md:max-w-[min(90%,22rem)]",
  "animate-[auth-float-y_4.5s_ease-in-out_infinite]",
  "object-contain object-center select-none motion-reduce:animate-none",
].join(" ");

export function AuthHeroPanel() {
  return (
    <section className={heroPanelClassName}>
      <AuthHeroPattern />

      <div className="relative z-1 flex flex-1 flex-col justify-between px-5 py-5 sm:px-6 sm:py-6 md:px-8 md:py-10">
        <div className="text-center md:text-left">
          <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
            Secure gateway
          </p>
          <h2 className="text-balance font-mono text-base sm:text-lg md:text-xl font-semibold uppercase leading-snug tracking-[0.06em] text-foreground">
            Open {APP_NAME}
          </h2>
          <p className="mx-auto mt-2 max-w-[22rem] text-pretty font-mono text-xs font-medium leading-relaxed tracking-wide text-muted md:mx-0 md:max-w-none">
            Chats, photos, and reactions stay in sync—sign in on the right to continue.
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center py-3 sm:py-4 md:py-6">
          <img
            src="/auth.png"
            alt="PingUp App Preview"
            width={640}
            height={640}
            className={heroImageClassName}
            draggable={false}
            decoding="async"
          />
        </div>

        <p className="text-center font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted md:text-left">
          End-to-end session · Encrypted in transit
        </p>
      </div>
    </section>
  );
}
