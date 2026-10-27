import { APP_NAME, AppLogo } from "../AppLogo";
import { AppearanceControls } from "../AppearanceControls";

function AuthHeader() {
  return (
    <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-2 border-b border-border bg-surface/90 px-3 py-2 backdrop-blur-md sm:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
        <AppLogo size={32} className="size-8 shrink-0 rounded-[8px]" alt="" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm sm:text-[15px] font-semibold leading-tight">{APP_NAME}</p>
          <p className="hidden xs:block truncate text-xs text-muted">Private session</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <AppearanceControls />
      </div>
    </header>
  );
}

export default AuthHeader;
